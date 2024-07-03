// var TASK_KEY = "tasks";
// var PER_PAGE = 10;
// var tasks = [];
// var totalPage = 0;
// var editTaskId = "";
// var searchValue = "";
// var filter = "";
// var page = 1;

// function $(id) {
//   return document.getElementById(id);
// }

// function $$(selector) {
//   return document.querySelectorAll(selector);
// }

// function setTask(tasks) {
//   localStorage.setItem(TASK_KEY, JSON.stringify(tasks));
// }

// function getTask() {
//   var tasksLocal = localStorage.getItem(TASK_KEY);
//   return JSON.parse(tasksLocal) || [];
// }

// function removeTask() {
//   localStorage.removeItem(TASK_KEY);
// }

// window.onload = function () {
//   // get tasks from local and render
//   tasks = getTask();
//   tasksFilter = getTask();
//   totalPage = Math.ceil(tasks.length / PER_PAGE);
//   renderTasks(getTaskPagination(page));
//   setTask(tasks);
//   renderPagination();

//   var addTaskElm = $("add-task");
//   var clearTaskElm = $("clear-task");
//   var taskInputElm = $("task");
//   var searchInputElm = $("search");
//   var filterElm = $("filter");

//   function renderTasks(tasksParam) {
//     var taskRender = tasksParam || tasks;

//     var taskList = $("task-list");
//     var taskListHtml = [];

//     if (taskRender.length === 0) {
//       taskListHtml.push("<p>No task !!!!</p>");
//     } else {
//       taskListHtml = taskRender.map(function (task) {
//         return `<div class="task-item">
//               <p class="task-content ${
//                 task.isChecked && "checked"
//               }" data-id="${task.id}">${task.name}</p>
//               <div>
//                 <button class="edit" data-id="${task.id}">i</button>
//                 <button class="delete" data-id="${task.id}">x</button>
//               </div>
//             </div>`;
//       });
//       taskList.innerHTML = taskListHtml.join("");

//       var editBtns = $$(".edit");
//       var deleteBtns = $$(".delete");
//       var taskContentBtns = $$(".task-content");

//       editBtns.forEach(function (btn) {
//         btn.onclick = function () {
//           var taskId = btn.getAttribute("data-id");
//           onClickEditTask(taskId);
//         };
//       });

//       deleteBtns.forEach(function (btn) {
//         btn.onclick = function () {
//           var taskId = btn.getAttribute("data-id");
//           deleteTask(taskId);
//         };
//       });
//       taskContentBtns.forEach(function (btn) {
//         btn.onclick = function () {
//           var taskId = btn.getAttribute("data-id");
//           handleCheck(taskId);
//         };
//       });
//     }
//   }

//   function renderPagination(totalPageParam) {
//     var totalPageRender = totalPageParam || totalPage;
//     var paginationHtml = [];
//     for (let index = 1; index <= totalPageRender; index++) {
//       paginationHtml.push(`<button data-page="${index}">${index}</button>`);
//     }

//     $("pagination").innerHTML = paginationHtml.join("--");

//     var paginationBtns = $$("button[data-page]");
//     paginationBtns.forEach(function (btn) {
//       btn.onclick = function () {
//         page = btn.getAttribute("data-page");
//         handleChangePage(page);
//       };
//     });
//   }

//   function onClickEditTask(taskId) {
//     var task = tasks.find(function (task) {
//       return task.id === taskId;
//     });

//     taskInputElm.value = task.name;
//     addTaskElm.value = "edit task";
//     editTaskId = taskId;
//   }

//   function deleteTask(taskId) {
//     var taskIndex = tasks.findIndex(function (task) {
//       return task.id === taskId;
//     });

//     if (taskIndex !== -1) {
//       tasks.splice(taskIndex, 1);
//     }

//     renderTasks();
//     setTask(tasks);
//   }

//   function handleCheck(taskId) {
//     var taskIndex = tasks.findIndex(function (task) {
//       return task.id === taskId;
//     });
//     if (taskIndex !== -1) {
//       tasks.splice(taskIndex, 1, {
//         id: taskId,
//         name: tasks[taskIndex].name,
//         isChecked: !tasks[taskIndex].isChecked,
//       });
//     }

//     renderTasks();
//     setTask(tasks);
//   }

//   function handleChangePage(page) {
//     renderTasks(getTaskPagination(page));
//   }

//   taskInputElm.onchange = function (e) {
//     if (e.target.value.length > 0) {
//       return (addTaskElm.disabled = false);
//     }

//     addTaskElm.disabled = true;
//   };

//   clearTaskElm.onclick = function () {
//     tasks = [];
//     removeTask();
//     renderTasks();
//   };

//   addTaskElm.onclick = function () {
//     const taskValue = taskInputElm.value;

//     // case create
//     if (editTaskId.length === 0) {
//       tasks.push({
//         id: new Date().getTime().toString(),
//         name: taskValue,
//         isChecked: false,
//       });
//       setTask(tasks);
//     } else {
//       // case edit
//       var taskIndex = tasks.findIndex(function (task) {
//         return task.id === editTaskId;
//       });

//       if (taskIndex !== -1) {
//         var task = tasks[taskIndex];

//         tasks.splice(taskIndex, 1, {
//           id: task.id,
//           isChecked: task.isChecked,
//           name: taskValue,
//         });

//         addTaskElm.value = "add task";
//         editTaskId = "";
//         setTask(tasks);
//       }
//     }

//     taskInputElm.value = "";
//     addTaskElm.disabled = true;
//     renderTasks();
//     calculatorPages();
//     renderPagination();
//   };

//   searchInputElm.onchange = function (e) {
//     searchValue = e.target.value;
//     filterTasks();
//   };

//   filterElm.onchange = function (e) {
//     filter = e.target.value;
//     filterTasks();
//   };

//   function filterTasks() {
//     var taskFilter = tasks.filter(function (task) {
//       if (filter === "0") {
//         return true && task.name.includes(searchValue);
//       }
//       if (filter === "-1") {
//         return task.isChecked === false && task.name.includes(searchValue);
//       }
//       if (filter === "1") {
//         return task.isChecked === true && task.name.includes(searchValue);
//       }
//     });

//     renderTasks(taskFilter);
//   }
//   function calculatorPages() {
//     totalPage = Math.ceil(tasks.length / PER_PAGE);
//   }
//   function getTaskPagination(pageParam) {
//     return tasks.slice((pageParam - 1) * 10, PER_PAGE * pageParam - 1);
//   }
// };
