 $(function () {
  var INDEX = 0;
  const input = document.getElementById("message-input");
  const user_logo = `<img src="../images/logo/logo_b_g.png" alt="User Avatar">`;
  const assistant_logo = `<img src="../images/logo/logo_g_b.png" alt="Assitant Avatar">`;
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      // Perform your submit action here
      var msg = input.value;
      if (msg.trim() == "") {
        return false;
      }
      input.value = "";
      generateMessage(msg, "user");
      generateMessage(msg, "assistant");
      console.log("Submitted:", input.value);
      // Clear the textarea if needed
    }
  });

  /**
   * Create the assistant container with the given message.
   * @param {string} message - The message to display in the container.
   * @returns {string} The HTML code for the user container.
   */
  const createUserContainer = (message) => {
    return `
  <div class="message">
    <div class="avatar-container">
      ${userLogo}
    </div>
    <div class="content" id="user_${INDEX}">${message}</div>
  </div>`;
  };

  /**
   * Create the assistant container with the given message.
   * @param {string} message - The message to display in the container.
   * @returns {string} The HTML code for the assistant container.
   */
  const createAssistantContainer = (message) => {
    return `
  <div class="message">
    <div class="avatar-container">
      ${assistant_logo}
    </div>
    <div class="content" id="assistant_${INDEX}">${message}</div>
  </div>`;
  };

  /**
   * Generate and display a message container based on the type of message.
   * @param {string} msg - The content of the message.
   * @param {string} type - The type of message ("User" or "Assistant").
   */
  const generateMessage = (msg, type) => {
    // Create a message container based on the type
    const container =
      type === "user"
        ? createUserContainer(msg)
        : createAssistantContainer(msg);

    // Get the messages element
    const messagesElement = $("#messages");

    // Append the container to the messages element
    messagesElement.append(container);

    // Scroll to the bottom of the messages element
    messagesElement
      .stop()
      .animate({ scrollTop: $(".box")[0].scrollHeight }, 1000);
  };
});
