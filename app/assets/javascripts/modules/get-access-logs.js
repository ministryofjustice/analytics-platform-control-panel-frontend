moj.Modules.accessLogs = {
  dropdownName: 'js-access-log-period-dropdown',

  init() {
    this.$dropdown = $(`#${this.dropdownName}`);

    if (this.$dropdown.length) {
      this.$form = this.$dropdown.closest('form');
      this.bindEvents();
      this.getAccessLogs();
    }
  },

  bindEvents() {
    this.$dropdown.on('change', () => {
      this.getAccessLogs();
    });
    this.$form.on('submit', (e) => {
      e.preventDefault();
    });
  },

  getAccessLogs() {
    const days = this.$dropdown.val();
    const url = this.$form.attr('action');
    const data = {};

    if (parseInt(days, 10)) {
      data.num_days = parseInt(days, 10);
    }

    $('#loading-message').show();
    $('#results').empty();

    $.ajax({
      url,
      method: 'GET',
      data,
      success: (response) => {
        this.showAccessLogs(response);
      },
      error: () => {
        this.showAccessLogs([]);
      },
    });
  },

  showAccessLogs(logs) {
    const tableHead = '<thead><tr><th>Accessed by</th><th>Count</th><th>Type</th></tr></thead>';
    let logsHTML;
    let tableBody;

    if (logs.length) {
      const rows = [];
      let i = 0;
      while (i < logs.length) {
        const cells = [];
        cells.push(`<td>${logs[i].accessed_by}</td>`);
        cells.push(`<td>${logs[i].count}</td>`);
        cells.push(`<td>${logs[i].type}</td>`);
        rows.push(`<tr>${cells.join('')}</tr>`);
        i += 1;
      }
      tableBody = `<tbody>${rows.join('')}</tbody>`;
      logsHTML = `<table>${tableHead}${tableBody}</table>`;
    } else {
      logsHTML = '<p><em>No access recorded for this period.</em></p>';
    }

    $('#loading-message').hide();
    $('#results').html(logsHTML);
  },
};
