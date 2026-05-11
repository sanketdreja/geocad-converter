self.onmessage = () => {
  self.postMessage({
    type: "preview-worker-ready",
    message: "Preview worker scaffold is ready for geometry simplification."
  });
};
