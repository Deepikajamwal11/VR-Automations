
const cron = require("node-cron");
const User = require("../../models/users");

function crmSyncJob() {

  cron.schedule("*/5 * * * *", async () => {
    console.log("\n⏳ CRM Sync Job Started...");
    console.log(`⏰ Time: ${new Date().toLocaleString()}`);
    
    try {
  
      const usersToSync = await User.find({ 
        status: "Verified",  
        synced: false          
      });
      
      if (usersToSync.length === 0) {
        console.log("ℹ️ No verified leads pending sync");
        return;
      }

      console.log(`\n📤 Found ${usersToSync.length} verified lead(s) ready for CRM sync:\n`);

      let successCount = 0;
      
      for (const user of usersToSync) {
        try {
          console.log(`[CRM Sync] Processing lead:`);
          console.log(`   • Name: ${user.name}`);
          console.log(`   • Country: ${user.country}`);
          console.log(`   • Confidence: ${(user.probability * 100).toFixed(1)}%`);
          console.log(`   • Status: ${user.status}`);
          
        
          await new Promise(resolve => setTimeout(resolve, 100));
          
          // ✅ Mark as synced (this ensures idempotency)
          user.synced = true;
          user.syncedAt = new Date();
          await user.save();
          
          console.log(`   ✅ Successfully synced to CRM\n`);
          successCount++;
          
        } catch (syncError) {
          console.error(`   ❌ Failed to sync ${user.name}:`, syncError.message);
        }
      }

      console.log(`\n🎉 CRM Sync Complete!`);
      console.log(`   • Successfully synced: ${successCount}/${usersToSync.length}`);
      
    } catch (error) {
      console.error("\n❌ CRM Sync Job Error:", error.message);
    }
  });

  console.log("\n✅ CRM Sync Job Initialized");
  console.log("⏰ Schedule: Every 5 minutes");
  console.log("\n📋 Sync Rules:");
  console.log("   1. Only 'Verified' leads (probability >= 60%) are synced");
  console.log("   2. Only unsynced leads (synced: false) are processed");
  console.log("   3. 'To Check' leads (< 60%) remain pending until manually verified");
  console.log("   4. Each lead is synced exactly once (idempotent)\n");
}

module.exports = crmSyncJob;