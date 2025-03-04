// src/utils/toastServices.js
export default {
  showError(toast, message) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: message,
      life: 3000,
    });
  },
  showSuccess(toast, message) {
    toast.add({
      severity: "success",
      summary: "Success",
      detail: message,
      life: 3000,
    });
  },
};
