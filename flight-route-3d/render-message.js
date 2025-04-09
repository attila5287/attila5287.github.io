'use strict';
export const renderMessage = function (message) {
  const messageEl = document.querySelector(".message-text");
  messageEl.textContent = message;
};

