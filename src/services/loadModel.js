const tf = require("@tensorflow/tfjs-node");
async function loadModel() {
  return tf.loadGraphModel(
    "https://storage.googleapis.com/mlgc-submission-gcc-rafi/submission-model/model.json"
  );
}
module.exports = loadModel;
