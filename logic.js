    // Initialization

    const addTaskBtn = document.querySelector("#taskAddBtn");
    const dialogBox = document.querySelector("#myDialogBox");
    const clsDialogBtn = document.querySelector("#closeDialogBtn");
    const submitBtn = document.querySelector("#submitForm");
    const activeBox = document.querySelector("#activeTask");
    const compBox = document.querySelector("#compTask");
    const delBox = document.querySelector("#deletedTask");
    const taskHeading = document.querySelector("#taskHead");
    const taskDes = document.querySelector("#taskDescription");
    const dateContainer = document.querySelector("#dateContainer");
    const editDialog = document.querySelector("#editTaskDialog");
    const closeEditDialog = document.querySelector("#closeEditDialog");
    const taskArray = JSON.parse(localStorage.getItem("tasks")) || [];
    const today = new Date();

    // Dialog show and close Modal

    addTaskBtn.addEventListener("click", () => {
      dialogBox.showModal();
    });
    clsDialogBtn.addEventListener("click", () => {
      dialogBox.close();
    });

    // Active task function

    function countActiveTask() {
      return taskArray.filter(task => !task.isComp && !task.isDel).length;
    }

    // count completed task function

    function countCompTask() {
      return taskArray.filter(task => task.isComp).length;
    }

    // count deleted task function

    function countDelTask() {
      return taskArray.filter(task => task.isDel).length;
    }

    // load task function

    function loadTasks() {
      activeBox.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:center;"><h1>Active Tasks</h1><span style="font-size:23px;">${countActiveTask() || 0} active tasks</span></div>`;
      compBox.innerHTML = `<div style="display:flex; justify-content: space-between; align-items: center;"><h3>Completed Task</h3><span style="font-size : 20px">${countCompTask() || 0} task completed</span></div>`;
      delBox.innerHTML = `<div style="display:flex; justify-content: space-between; align-items: center"><h3>Deleted Task</h3><span style="font-size:20px;">${countDelTask() || 0} task deleted</span></div>`;
      if (taskArray.length == 0) {
        activeBox.innerHTML += `<center><h1 style="margin-top: 30px">No active tasks right now </h1></center>`;
        return;
      }
      taskArray.forEach((task, index) => {
        if (!task.isComp && !task.isDel) {
          activeBox.innerHTML += `<div class="taskContainer">
            <h3 style='text-transform: capitalize'>${task.name}</h3>
            <p>${task.description}</p>
            <div class="btnContainer" idx=${index} data-name=${task.name} data-des=${task.description}>
              <button type="button" class="editTask actionBtn">Edit task</button>
              <button type="button" class="compTask actionBtn">
                Mark as done
              </button>
              <button type="button" class="deleteTask actionBtn">
                Abort this task
              </button>
            </div>
          </div>`;
        } else if (task.isComp && !task.isDel) {
          compBox.innerHTML += `<div class="taskContainer">
            <h3 style='text-transform: capitalize'>${task.name}</h3>
            <p>${task.description}</p></div>`;
        } else if (!task.isComp && task.isDel) {
          delBox.innerHTML += `<div class="taskContainer">
            <h3 style='text-transform: capitalize'>${task.name}</h3>
            <p>${task.description}</p>
          </div>`;
        }
      });
    }
    // date and time

    dateContainer.innerHTML = `<span>${today.getDate()}/${today.getMonth()+1}/${today.getFullYear()}</span>`;

    // Add task button

    submitBtn.addEventListener("click", (e) => {
      e.preventDefault();

      if (!taskHeading.value || !taskDes.value) return;
      const task = {
        name: taskHeading.value,
        description: taskDes.value,
        isComp: false,
        isDel: false,
      };
      taskArray.push(task);
      localStorage.setItem("tasks", JSON.stringify(taskArray));
      console.log(JSON.parse(localStorage.getItem("tasks")));
      taskHeading.value = "";
      taskDes.value = "";
      dialogBox.close();
      loadTasks();
      location.reload();
    });

    loadTasks();

    // Complete task and delete task

    const compBtn = document.querySelectorAll(".compTask");
    const delBtn = document.querySelectorAll(".deleteTask");
    const editBtn = document.querySelectorAll(".editTask");
    const cnfrmEdit = document.querySelector("#editForm");

    compBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        const parentElem = btn.parentElement;
        const idx = parentElem.getAttribute("idx");
        taskArray[idx].isComp = true;
        localStorage.setItem("tasks", JSON.stringify(taskArray));
        loadTasks();
        location.reload();
      });
    });
    delBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        const parentElem = btn.parentElement;
        const idx = parentElem.getAttribute("idx");
        taskArray[idx].isDel = true;
        localStorage.setItem("tasks", JSON.stringify(taskArray));
        loadTasks();
        location.reload();
      });
    });
    editBtn.forEach((btn) => {
      btn.addEventListener("click", () => {
        const parentElement = btn.parentElement;
        const taskNameForEdit = parentElement.getAttribute("data-name");
        const taskDesForEdit = parentElement.getAttribute("data-des");
        const taskIdxEdit = parentElement.getAttribute("idx");
        editDialog.showModal();
        document.querySelector("#editFormInput").value = taskNameForEdit;
        document.querySelector("#editFormText").value = taskDesForEdit;
        document
          .querySelector("#editTaskForm")
          .setAttribute("idx", taskIdxEdit);
      });
    });
    closeEditDialog.addEventListener("click", () => {
      editDialog.close();
    });
    cnfrmEdit.addEventListener("click", (e) => {
      e.preventDefault();
      const i = cnfrmEdit.parentElement.getAttribute("idx");
      taskArray[i].name = document.querySelector("#editFormInput").value;
      taskArray[i].description = document.querySelector("#editFormText").value;
      loadTasks();
      editDialog.close();
    });