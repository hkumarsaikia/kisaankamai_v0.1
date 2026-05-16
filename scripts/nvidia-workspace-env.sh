#!/usr/bin/env bash
# Source this file to make manual workspace commands prefer the NVIDIA dGPU.
# npm scripts apply the same defaults through scripts/hardware-tuned-runner.mjs.

export KK_GPU_MODE="nvidia-fixed"
export KK_NVIDIA_GPU_REQUIRED="1"

export CUDA_DEVICE_ORDER="PCI_BUS_ID"
export CUDA_VISIBLE_DEVICES="${CUDA_VISIBLE_DEVICES:-0}"
export NVIDIA_VISIBLE_DEVICES="${NVIDIA_VISIBLE_DEVICES:-all}"
export NVIDIA_DRIVER_CAPABILITIES="${NVIDIA_DRIVER_CAPABILITIES:-all}"
export PYTORCH_NVML_BASED_CUDA_CHECK="${PYTORCH_NVML_BASED_CUDA_CHECK:-1}"

export __NV_PRIME_RENDER_OFFLOAD="1"
export __GLX_VENDOR_LIBRARY_NAME="nvidia"
export __VK_LAYER_NV_optimus="NVIDIA_only"
export DRI_PRIME="1"
export LIBVA_DRIVER_NAME="nvidia"

if [ -f /usr/share/glvnd/egl_vendor.d/10_nvidia.json ]; then
  export __EGL_VENDOR_LIBRARY_FILENAMES="/usr/share/glvnd/egl_vendor.d/10_nvidia.json"
fi

export PUPPETEER_EXECUTABLE_PATH="${PUPPETEER_EXECUTABLE_PATH:-/usr/bin/google-chrome}"
export CHROME_BIN="${CHROME_BIN:-$PUPPETEER_EXECUTABLE_PATH}"
export BROWSER="${BROWSER:-$PUPPETEER_EXECUTABLE_PATH}"
