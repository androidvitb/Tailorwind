document.addEventListener('DOMContentLoaded', () => {
    const table = document.getElementById('table-preview');
    const exportCode = document.getElementById('export-code');
    const borderStyleSelector = document.getElementById('border-style');
    const textAlignSelector = document.getElementById('text-align');
    const bgColorPicker = document.getElementById('cell-bg-color');

    const updateExportCode = () => {
      exportCode.value = table.outerHTML;
    };

    // Add Row
    document.getElementById('add-row').addEventListener('click', () => {
      const row = document.createElement('tr');
      const columns = table.querySelector('thead tr').children.length;
      for (let i = 0; i < columns; i++) {
        const cell = document.createElement('td');
        cell.contentEditable = true;
        cell.className = `border border-gray-300 px-4 py-2 ${textAlignSelector.value}`;
        cell.style.backgroundColor = bgColorPicker.value;
        cell.textContent = `Row ${table.querySelector('tbody').children.length + 1} Col ${i + 1}`;
        row.appendChild(cell);
      }
      table.querySelector('tbody').appendChild(row);
      updateExportCode();
    });

    // Add Column
    document.getElementById('add-column').addEventListener('click', () => {
      const headerRow = table.querySelector('thead tr');
      const headerCell = document.createElement('th');
      headerCell.contentEditable = true;
      headerCell.className = `border border-gray-300 px-4 py-2 bg-gray-100 ${textAlignSelector.value}`;
      headerCell.style.backgroundColor = bgColorPicker.value;
      headerCell.textContent = `Header ${headerRow.children.length + 1}`;
      headerRow.appendChild(headerCell);

      table.querySelectorAll('tbody tr').forEach((row) => {
        const cell = document.createElement('td');
        cell.contentEditable = true;
        cell.className = `border border-gray-300 px-4 py-2 ${textAlignSelector.value}`;
        cell.style.backgroundColor = bgColorPicker.value;
        cell.textContent = `Row ${Array.from(row.parentNode.children).indexOf(row) + 1} Col ${headerRow.children.length}`;
        row.appendChild(cell);
      });
      updateExportCode();
    });

    // Remove Row
    document.getElementById('remove-row').addEventListener('click', () => {
      const rows = table.querySelector('tbody').children;
      if (rows.length > 0) {
        rows[rows.length - 1].remove();
        updateExportCode();
      } else {
        alert('No more rows to remove!');
      }
    });

    // Remove Column
    document.getElementById('remove-column').addEventListener('click', () => {
      const headerRow = table.querySelector('thead tr');
      const columns = headerRow.children;
      if (columns.length > 0) {
        headerRow.removeChild(columns[columns.length - 1]);

        table.querySelectorAll('tbody tr').forEach((row) => {
          const cells = row.children;
          if (cells.length > 0) {
            row.removeChild(cells[cells.length - 1]);
          }
        });
        updateExportCode();
      } else {
        alert('No more columns to remove!');
      }
    });

    // Change Border Style
    borderStyleSelector.addEventListener('change', (e) => {
      const styleClass = e.target.value;
      table.className = `table-auto w-full border-collapse ${styleClass}`;
      updateExportCode();
    });

    // Change Text Alignment
    textAlignSelector.addEventListener('change', (e) => {
      table.querySelectorAll('th, td').forEach((cell) => {
        cell.classList.remove('text-left', 'text-center', 'text-right');
        cell.classList.add(e.target.value);
      });
      updateExportCode();
    });

    // Change Background Color
    bgColorPicker.addEventListener('input', (e) => {
      table.querySelectorAll('th, td').forEach((cell) => {
        cell.style.backgroundColor = e.target.value;
      });
      updateExportCode();
    });

    // Copy Code
    document.getElementById('copy-code').addEventListener('click', () => {
      navigator.clipboard.writeText(exportCode.value).then(() => {
        alert('Code copied to clipboard!');
      });
    });

    // Initialize Export Code
    updateExportCode();
  });
