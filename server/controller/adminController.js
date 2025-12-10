
const axios = require("axios");
const User = require("../models/users");

module.exports = {
  create: async (req, res) => {
    try {
      let names = req.body.names || req.body.name;
      if (!names) {
        return res.status(400).json({ success: false, message: "names is required" });
      }

      if (typeof names === "string") {
        names = names
          .split(",")
          .map((n) => n.trim())
          .filter((n) => n.length > 0);
      }

      if (!Array.isArray(names) || names.length === 0) {
        return res.status(400).json({
          success: false,
          message: "names must be array or comma string",
        });
      }

      const tasks = names.map(async (name) => {
        try {
          const apiRes = await axios.get(
            `https://api.nationalize.io?name=${encodeURIComponent(name)}`
          );
          const top = apiRes.data.country?.[0];

          const country = top ? top.country_id : "UN";
          const probability = top ? top.probability : 0; // 0–1

          // ✅ CRITICAL FIX: Use >= 0.6 (not > 0.6) to match 60% threshold exactly
          // Rule 1: probability >= 0.6 (60%) => Verified
          // Rule 2: probability < 0.6 (60%) => To Check
          const status = probability >= 0.6 ? "Verified" : "To Check";

          console.log(`Processing: ${name} | Country: ${country} | Probability: ${(probability * 100).toFixed(1)}% | Status: ${status}`);

          // ✅ IMPORTANT: synced is always false on initial create
          // Only "Verified" leads will be synced by the cron job
          // "To Check" leads remain pending (synced: false)
          return await User.create({ 
            name, 
            country, 
            probability, 
            status,
            synced: false  // Always start as not synced
          });
        } catch (e) {
          console.error("Nationalize error:", name, e.message);
          return null;
        }
      });

      const results = await Promise.all(tasks);
      const data = results.filter((d) => d);

      return res.json({
        success: true,
        message: "Leads processed",
        totalProcessed: data.length,
        data,
      });
    } catch (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Server error", error: err.message });
    }
  },
  userList: async (req, res) => {
    try {
      const { status } = req.query;
      const query = {};
      if (status && ["Verified", "To Check"].includes(status)) {
        query.status = status;
      }
      const users = await User.find(query).sort({ createdAt: -1 });
      return res.json({ success: true, data: users });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: "Error fetching users", error: err.message });
    }
  },
  status: async (req, res) => {
    try {
      const { id, status } = req.body;
      if (!["Verified", "To Check"].includes(status)) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid status" });
      }

      // ✅ When status changes, reset synced to false
      // This allows:
      // - "To Check" -> "Verified": Will be synced in next cron job
      // - "Verified" -> "To Check": Will show as pending again
      const user = await User.findByIdAndUpdate(
        id, 
        { 
          status,
          synced: false  // Reset sync status when manually changed
        }, 
        { new: true }
      );
      
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: "User not found" });
      }

      return res.json({ success: true, data: user });
    } catch (err) {
      return res
        .status(500)
        .json({ success: false, message: err.message });
    }
  },
  triggerSync: async (req, res) => {
    try {
      const usersToSync = await User.find({ 
        status: "Verified",
        synced: false 
      });

      if (usersToSync.length === 0) {
        return res.json({
          success: true,
          message: "No verified leads pending sync",
          synced: 0
        });
      }

      let syncedCount = 0;
      for (const user of usersToSync) {
        // Simulate CRM sync
        user.synced = true;
        user.syncedAt = new Date();
        await user.save();
        syncedCount++;
        
        console.log(`[Manual Sync] ${user.name} → Synced to CRM`);
      }

      return res.json({
        success: true,
        message: `Successfully synced ${syncedCount} verified lead(s)`,
        synced: syncedCount
      });
    } catch (err) {
      return res.status(500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
};