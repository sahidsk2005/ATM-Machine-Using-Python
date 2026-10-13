const storageKey = "sbi_atm_state";

function readState() {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return { pin: "", balance: 0 };
  try {
    return JSON.parse(raw);
  } catch {
    return { pin: "", balance: 0 };
  }
}

function saveState(state) {
  localStorage.setItem(storageKey, JSON.stringify(state));
}

function showMessage(msg, isOk = true) {
  const out = document.getElementById("out");
  out.textContent = msg;
  out.className = `message ${isOk ? "ok" : "err"}`;
  out.style.display = "block";
}

function clearForm() {
  document.getElementById("form").innerHTML = "";
}

function showForm(fields) {
  const form = document.getElementById("form");
  form.innerHTML = "";

  const wrapper = document.createElement("div");
  wrapper.style.marginTop = "1rem";

  fields.forEach((field) => {
    const label = document.createElement("label");
    label.textContent = field.label;

    const input = document.createElement(field.type === "number" ? "input" : "input");
    input.type = field.type || "text";
    input.placeholder = field.placeholder || "";
    input.id = field.name;
    input.value = field.value || "";

    wrapper.appendChild(label);
    wrapper.appendChild(input);
  });

  const submit = document.createElement("button");
  submit.type = "button";
  submit.className = "btn primary";
  submit.textContent = "Submit";
  wrapper.appendChild(submit);

  form.appendChild(wrapper);

  submit.addEventListener("click", () => {
    const values = {};
    fields.forEach((field) => {
      const el = document.getElementById(field.name);
      values[field.name] = el.value;
    });
    fields[0].handler(values);
  });
}

function createPin() {
  showForm([
    {
      name: "pin",
      label: "New PIN",
      type: "password",
      placeholder: "Enter 4-digit PIN",
      handler: ({ pin }) => {
        const state = readState();
        if (!pin || pin.length < 4) {
          showMessage("PIN must be at least 4 digits.", false);
          return;
        }
        state.pin = pin;
        saveState(state);
        showMessage("PIN set successfully.");
        clearForm();
      }
    }
  ]);
}

function deposit() {
  const state = readState();
  if (!state.pin) {
    showMessage("Please create a PIN first.", false);
    return;
  }

  showForm([
    {
      name: "pin",
      label: "Enter your PIN",
      type: "password",
      placeholder: "PIN",
      handler: ({ pin }) => {
        if (pin !== state.pin) {
          showMessage("Invalid PIN.", false);
          clearForm();
          return;
        }

        showForm([
          {
            name: "amount",
            label: "Enter amount to deposit",
            type: "number",
            placeholder: "1000",
            handler: ({ amount }) => {
              const amt = Number(amount);
              if (!amt || amt <= 0) {
                showMessage("Enter a valid amount.", false);
                return;
              }
              const s = readState();
              s.balance += amt;
              saveState(s);
              showMessage(`Deposit successful. New balance: ${s.balance}`);
              clearForm();
            }
          }
        ]);
      }
    }
  ]);
}

function withdraw() {
  const state = readState();
  if (!state.pin) {
    showMessage("Please create a PIN first.", false);
    return;
  }

  showForm([
    {
      name: "pin",
      label: "Enter your PIN",
      type: "password",
      placeholder: "PIN",
      handler: ({ pin }) => {
        if (pin !== state.pin) {
          showMessage("Invalid PIN.", false);
          clearForm();
          return;
        }

        showForm([
          {
            name: "amount",
            label: "Enter amount to withdraw",
            type: "number",
            placeholder: "500",
            handler: ({ amount }) => {
              const amt = Number(amount);
              if (!amt || amt <= 0) {
                showMessage("Enter a valid amount.", false);
                return;
              }
              const s = readState();
              if (amt > s.balance) {
                showMessage("Insufficient funds.", false);
                return;
              }
              s.balance -= amt;
              saveState(s);
              showMessage(`Withdrawal successful. Remaining balance: ${s.balance}`);
              clearForm();
            }
          }
        ]);
      }
    }
  ]);
}

function checkBalance() {
  const state = readState();
  if (!state.pin) {
    showMessage("Please create a PIN first.", false);
    return;
  }

  showForm([
    {
      name: "pin",
      label: "Enter your PIN",
      type: "password",
      placeholder: "PIN",
      handler: ({ pin }) => {
        if (pin !== state.pin) {
          showMessage("Invalid PIN.", false);
          clearForm();
          return;
        }
        const s = readState();
        showMessage(`Your balance is: ${s.balance}`);
        clearForm();
      }
    }
  ]);
}

function changePin() {
  const state = readState();
  if (!state.pin) {
    showMessage("Please create a PIN first.", false);
    return;
  }

  showForm([
    {
      name: "oldPin",
      label: "Enter old PIN",
      type: "password",
      placeholder: "Old PIN",
      handler: ({ oldPin }) => {
        if (oldPin !== state.pin) {
          showMessage("Invalid old PIN.", false);
          clearForm();
          return;
        }

        showForm([
          {
            name: "newPin",
            label: "Enter new PIN",
            type: "password",
            placeholder: "New PIN",
            handler: ({ newPin }) => {
              if (!newPin || newPin.length < 4) {
                showMessage("New PIN must be at least 4 digits.", false);
                return;
              }
              const s = readState();
              s.pin = newPin;
              saveState(s);
              showMessage("PIN changed successfully.");
              clearForm();
            }
          }
        ]);
      }
    }
  ]);
}

function resetATM() {
  localStorage.removeItem(storageKey);
  showMessage("ATM data cleared.");
  clearForm();
}

document.querySelectorAll("[data-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const action = button.dataset.action;
    if (action === "create") createPin();
    if (action === "deposit") deposit();
    if (action === "withdraw") withdraw();
    if (action === "balance") checkBalance();
    if (action === "change") changePin();
    if (action === "reset") resetATM();
  });
});
