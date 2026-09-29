// Step 2 (classification) will hook in here.
async function enqueueTask(task) {
  try {
    console.log(`[orchestrator] task ${task._id} received (modality: ${task.modality})`);
  } catch (error) {
    console.error(`[orchestrator] Error logging task: ${error.message}`);
  }
}

module.exports = {
  enqueueTask
};
