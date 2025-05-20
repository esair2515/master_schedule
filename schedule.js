// schedule.js

document.addEventListener("DOMContentLoaded", () => {
  const weekToggles = document.querySelectorAll(".toggle-week");
  const dayToggles = document.querySelectorAll(".toggle-day");
  const checkboxes = document.querySelectorAll(".task-check");

  // Toggle week visibility
  weekToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const week = btn.parentElement;
      const days = week.querySelector(".days");
      days.classList.toggle("hidden");
    });
  });

  // Toggle day visibility
  dayToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const day = btn.parentElement;
      const tasks = day.querySelector(".tasks");
      tasks.classList.toggle("hidden");
    });
  });

  // Save task completion in localStorage
  checkboxes.forEach((box) => {
    const taskId = box.closest(".task").dataset.taskId;
    const saved = localStorage.getItem(taskId);
    if (saved === "true") {
      box.checked = true;
    }

    box.addEventListener("change", () => {
      localStorage.setItem(taskId, box.checked);
    });
  });
});
