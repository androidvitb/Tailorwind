// Toggle the menu on mobile
const menuToggle = document.getElementById('menu-toggle');
const menu = document.getElementById('menu');

menuToggle.addEventListener('click', () => {
  menu.classList.toggle('hidden');
});


// Dark mode implementation
    document.addEventListener('DOMContentLoaded', () => {
      const darkModeToggle = document.getElementById('darkModeToggle');
      const lightIcon = document.getElementById('lightIcon');
      const darkIcon = document.getElementById('darkIcon');

      // Add transition class to html element
      document.documentElement.classList.add('transition-colors', 'duration-500');

      // Check for saved dark mode preference
      if (localStorage.getItem('darkMode') === 'enabled') {
        document.documentElement.classList.add('dark');
        lightIcon.classList.add('hidden');
        darkIcon.classList.remove('hidden');
      }

      darkModeToggle.addEventListener('click', () => {
        // Animate icons
        lightIcon.style.transform = 'rotate(180deg) scale(0.5)';
        darkIcon.style.transform = 'rotate(180deg) scale(0.5)';

        setTimeout(() => {
          // Toggle dark mode
          document.documentElement.classList.toggle('dark');

          // Toggle icons
          lightIcon.classList.toggle('hidden');
          darkIcon.classList.toggle('hidden');

          // Reset transforms
          lightIcon.style.transform = 'rotate(0) scale(1)';
          darkIcon.style.transform = 'rotate(0) scale(1)';

          // Save preference
          if (document.documentElement.classList.contains('dark')) {
            localStorage.setItem('darkMode', 'enabled');
          } else {
            localStorage.setItem('darkMode', 'disabled');
          }
        }, 150);
      });
    });