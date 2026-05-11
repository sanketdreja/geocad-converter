self.onmessage = () => {
  self.postMessage({
    type: "worker-ready",
    message: "Conversion worker scaffold is ready for future heavy geometry jobs."
  });
};
