var TASK_KEY = "tasks";
var PER_PAGE = 10;
var tasks = [];
var filteredTasks = []; //
var totalPage = 0;
var editTaskId = "";
var searchValue = "";
var filter = "";
var page = 1;

function $(id) {
  return document.getElementById(id);
}

function $$(selector) {
  return document.querySelectorAll(selector);
}

function setTask(tasks) {
  localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
}

// function getTask() {
//   var tasksLocal = localStorage.getItem(TASK_KEY);
//   return JSON.parse(tasksLocal) || [];
// }
async function getTask() {
  try {
    const response = await fetch("http://localhost:3000/tasks");
    const tasks = await response.json();
    return tasks || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return [];
  }
}

function removeTask() {
  localStorage.removeItem(TASK_KEY);
}

window.onload = async function () {
  // get tasks from api and render
  tasks = await getTask();
  filteredTasks = tasks; //
  totalPage = Math.ceil(filteredTasks.length / PER_PAGE); //
  renderTasks(getTaskPagination(page));
  setTask(tasks);
  renderPagination();

  var addTaskElm = $("add-task");
  var clearTaskElm = $("clear-task");
  var taskInputElm = $("task");
  var searchInputElm = $("search");
  var filterElm = $("filter");

  function renderTasks(tasksParam) {
    var taskRender = tasksParam || filteredTasks;

    var taskList = $("task-list");
    var taskListHtml = [];

    if (taskRender.length === 0) {
      taskListHtml.push("<p>No task !!!!</p>");
    } else {
      taskListHtml = taskRender.map(function (task) {
        return `<div class="task-item">
              <p class="task-content ${
                task.isChecked && "checked"
              }" data-id="${task.id}">${task.name}</p>
              <div>
                <button class="edit" data-id="${task.id}">i</button>
                <button class="delete" data-id="${task.id}">x</button>
              </div>
            </div>`;
      });
      taskList.innerHTML = taskListHtml.join("");

      var editBtns = $$(".edit");
      var deleteBtns = $$(".delete");
      var taskContentBtns = $$(".task-content");

      editBtns.forEach(function (btn) {
        btn.onclick = function () {
          var taskId = btn.getAttribute("data-id");
          onClickEditTask(taskId);
        };
      });

      // deleteBtns.forEach(function (btn) {
      //   btn.onclick = function () {
      //     var taskId = btn.getAttribute("data-id");
      //     deleteTask(taskId);
      //   };
      // });
      async function deleteTask(taskId) {
        try {
          await fetch(`http://localhost:3000/tasks/${taskId}`, {
            method: "DELETE",
          });
        } catch (error) {
          console.error("Error deleting task:", error);
          alert("Xóa công việc thất bại. Vui lòng thử lại.");
        }
      }

      deleteBtns.forEach(function (btn) {
        btn.onclick = async function () {
          const taskId = btn.getAttribute("data-id");
          await deleteTask(taskId);
          tasks = tasks.filter((task) => task.id !== taskId);
          setTask(tasks);
          filterTasks();
        };
      });

      taskContentBtns.forEach(function (btn) {
        btn.onclick = function () {
          var taskId = btn.getAttribute("data-id");
          handleCheck(taskId);
        };
      });
    }
  }

  function renderPagination(totalPageParam) {
    var totalPageRender = totalPageParam || totalPage;
    var paginationHtml = [];
    for (let index = 1; index <= totalPageRender; index++) {
      paginationHtml.push(`<button data-page="${index}">${index}</button>`);
    }

    $("pagination").innerHTML = paginationHtml.join("--");

    var paginationBtns = $$("button[data-page]");
    paginationBtns.forEach(function (btn) {
      btn.onclick = function () {
        page = parseInt(btn.getAttribute("data-page")); //
        handleChangePage(page);
      };
    });
  }

  function onClickEditTask(taskId) {
    var task = tasks.find(function (task) {
      return task.id === taskId;
    });

    taskInputElm.value = task.name;
    addTaskElm.value = "edit task";
    editTaskId = taskId;
  }

  function deleteTask(taskId) {
    var taskIndex = tasks.findIndex(function (task) {
      return task.id === taskId;
    });

    if (taskIndex !== -1) {
      tasks.splice(taskIndex, 1);
    }

    // filterTasks(); //
    renderTasks();
    setTask(tasks);
  }

  // function handleCheck(taskId) {
  //   var taskIndex = tasks.findIndex(function (task) {
  //     return task.id === taskId;
  //   });
  //   if (taskIndex !== -1) {
  //     tasks.splice(taskIndex, 1, {
  //       id: taskId,
  //       name: tasks[taskIndex].name,
  //       isChecked: !tasks[taskIndex].isChecked,
  //     });
  //   }

  //   // filterTasks(); //
  //   renderTasks();
  //   setTask(tasks);
  // }
  async function updateTask(id, updatedTask) {
    try {
      const response = await fetch(`http://localhost:3000/tasks/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTask),
      });
      const result = await response.json();
      return result;
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Cập nhật công việc thất bại. Vui lòng thử lại.");
    }
  }

  async function handleCheck(taskId) {
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].isChecked = !tasks[taskIndex].isChecked;
      await updateTask(taskId, tasks[taskIndex]);
      setTask(tasks);
      filterTasks();
    }
  }

  function handleChangePage(page) {
    renderTasks(getTaskPagination(page));
  }

  taskInputElm.onchange = function (e) {
    if (e.target.value.length > 0) {
      return (addTaskElm.disabled = false);
    }

    addTaskElm.disabled = true;
  };

  clearTaskElm.onclick = function () {
    tasks = [];
    removeTask();
    renderTasks();
  };

  // addTaskElm.onclick = function () {
  //   const taskValue = taskInputElm.value;

  //   // case create
  //   if (editTaskId.length === 0) {
  //     tasks.push({
  //       id: new Date().getTime().toString(),
  //       name: taskValue,
  //       isChecked: false,
  //     });
  //     setTask(tasks);
  //   } else {
  //     // case edit
  //     var taskIndex = tasks.findIndex(function (task) {
  //       return task.id === editTaskId;
  //     });

  //     if (taskIndex !== -1) {
  //       var task = tasks[taskIndex];

  //       tasks.splice(taskIndex, 1, {
  //         id: task.id,
  //         isChecked: task.isChecked,
  //         name: taskValue,
  //       });

  //       addTaskElm.value = "add task";
  //       editTaskId = "";
  //       setTask(tasks);
  //     }
  //   }

  //   taskInputElm.value = "";
  //   addTaskElm.disabled = true;
  //   // filterTasks();
  //   renderTasks();
  //   calculatorPages();
  //   renderPagination();
  // };
  async function addTask(task) {
    try {
      const response = await fetch("http://localhost:3000/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(task),
      });
      const newTask = await response.json();
      return newTask;
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Thêm công việc thất bại. Vui lòng thử lại.");
    }
  }

  addTaskElm.onclick = async function () {
    const taskValue = taskInputElm.value;
    const newTask = {
      id: new Date().getTime().toString(),
      name: taskValue,
      isChecked: false,
    };

    if (editTaskId.length === 0) {
      const addedTask = await addTask(newTask);
      tasks.push(addedTask);
    } else {
      const taskIndex = tasks.findIndex((task) => task.id === editTaskId);
      if (taskIndex !== -1) {
        const updatedTask = await updateTask(editTaskId, newTask);
        tasks[taskIndex] = updatedTask;
      }
      editTaskId = "";
      addTaskElm.value = "add task";
    }

    taskInputElm.value = "";
    addTaskElm.disabled = true;
    setTask(tasks);
    filterTasks();
  };

  searchInputElm.onchange = function (e) {
    searchValue = e.target.value;
    filterTasks();
  };

  filterElm.onchange = function (e) {
    filter = e.target.value;
    filterTasks();
  };

  function filterTasks() {
    filteredTasks = tasks.filter(function (task) {
      //
      if (filter === "0") {
        return true && task.name.includes(searchValue);
      }
      if (filter === "-1") {
        return task.isChecked === false && task.name.includes(searchValue);
      }
      if (filter === "1") {
        return task.isChecked === true && task.name.includes(searchValue);
      }
    });

    calculatorPages(); //
    renderTasks(getTaskPagination(1)); // render all filteredTasks
    renderPagination(); //
  }
  function calculatorPages() {
    totalPage = Math.ceil(filteredTasks.length / PER_PAGE); //
  }
  function getTaskPagination(pageParam) {
    var tasksPage = filteredTasks.slice(
      (pageParam - 1) * PER_PAGE,
      PER_PAGE * pageParam
    );
    if (tasksPage.length === 0) {
      $("task-list").innerHTML = "<p>No task !!!!</p>";
    }
    return tasksPage;
  }
};
