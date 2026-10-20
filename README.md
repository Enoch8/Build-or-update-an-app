const STORAGE_KEY = 'ghana-school-fees-dashboard';

const demoData = {
  students: [
    {
      id: 'student-1',
      fullName: 'Ama Boateng',
      className: 'JHS 3',
      guardianName: 'Kwame Boateng',
      contact: '0244 123 456'
    },
    {
      id: 'student-2',
      fullName: 'Kofi Mensah',
      className: 'SHS 2',
      guardianName: 'Abena Mensah',
      contact: '0203 987 654'
    }
  ],
  fees: [
    { id: 'fee-1', studentId: 'student-1', category: 'Tuition', amount: 1500, dueDate: '2026-10-15', status: 'active' },
    { id: 'fee-2', studentId: 'student-1', category: 'Exam Fees', amount: 350, dueDate: '2026-10-20', status: 'active' },
    { id: 'fee-3', studentId: 'student-2', category: 'Tuition', amount: 2200, dueDate: '2026-10-16', status: 'active' }
  ],
  payments: [
    { id: 'pay-1', studentId: 'student-1', feeId: 'fee-1', amount: 600, method: 'Mobile Money', notes: 'Term 1 payment', date: '2026-10-03' },
    { id: 'pay-2', studentId: 'student-2', feeId: 'fee-3', amount: 800, method: 'Bank Transfer', notes: 'Initial deposit', date: '2026-10-04' }
  ]
};

const state = loadState();

const ui = {
  studentForm: document.getElementById('studentForm'),
  feeForm: document.getElementById('feeForm'),
  paymentForm: document.getElementById('paymentForm'),
  studentList: document.getElementById('studentList'),
  paymentHistory: document.getElementById('paymentHistory'),
  feeStudentSelect: document.getElementById('feeStudentSelect'),
  paymentStudentSelect: document.getElementById('paymentStudentSelect'),
  feeIdSelect: document.getElementById('feeIdSelect'),
  exportSummaryPdf: document.getElementById('exportSummaryPdf'),
  studentsCount: document.getElementById('studentsCount'),
  totalDue: document.getElementById('totalDue'),
  totalPaid: document.getElementById('totalPaid'),
  totalOutstanding: document.getElementById('totalOutstanding')
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (error) {
      console.warn('Unable to parse saved state, using demo data instead.');
    }
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
  return structuredClone(demoData);
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-GH', {
    style: 'currency',
    currency: 'GHS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value || 0));
}

function generateId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2, 8)}`;
}

function getStudentById(studentId) {
  return state.students.find((student) => student.id === studentId);
}

function getFeeById(feeId) {
  return state.fees.find((fee) => fee.id === feeId);
}

function getTotalFeesForStudent(studentId) {
  return state.fees
    .filter((fee) => fee.studentId === studentId)
    .reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
}

function getTotalPaymentsForStudent(studentId) {
  return state.payments
    .filter((payment) => payment.studentId === studentId)
    .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
}

function getOutstandingForStudent(studentId) {
  return getTotalFeesForStudent(studentId) - getTotalPaymentsForStudent(studentId);
}

function getStudentFeeOptions(studentId) {
  return state.fees.filter((fee) => fee.studentId === studentId);
}

function renderSelectors() {
  const options = state.students
    .map((student) => `<option value="${student.id}">${student.fullName} (${student.className})</option>`)
    .join('');

  ui.feeStudentSelect.innerHTML = options || '<option value="">No students yet</option>';
  ui.paymentStudentSelect.innerHTML = options || '<option value="">No students yet</option>';

  const selectedStudentId = ui.paymentStudentSelect.value || state.students[0]?.id || '';
  const feeOptions = getStudentFeeOptions(selectedStudentId)
    .map((fee) => `<option value="${fee.id}">${fee.category} - ${formatCurrency(fee.amount)}</option>`)
    .join('');

  ui.feeIdSelect.innerHTML = `<option value="">General payment</option>${feeOptions}`;
}

function renderSummary() {
  const studentsCount = state.students.length;
  const totalDue = state.fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  const totalPaid = state.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const outstanding = totalDue - totalPaid;

  ui.studentsCount.textContent = studentsCount;
  ui.totalDue.textContent = formatCurrency(totalDue);
  ui.totalPaid.textContent = formatCurrency(totalPaid);
  ui.totalOutstanding.textContent = formatCurrency(outstanding);
}

function renderStudentList() {
  if (!state.students.length) {
    ui.studentList.innerHTML = '<div class="empty-state">No students have been added yet.</div>';
    return;
  }

  ui.studentList.innerHTML = state.students
    .map((student) => {
      const totalFees = getTotalFeesForStudent(student.id);
      const totalPaid = getTotalPaymentsForStudent(student.id);
      const outStanding = totalFees - totalPaid;

      const feeDetails = state.fees.filter((fee) => fee.studentId === student.id);
      const latestFee = feeDetails.length ? feeDetails.slice().sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate))[0] : null;

      return `
        <article class="student-card">
          <div class="student-top">
            <div>
              <h3>${student.fullName}</h3>
              <p class="meta-line">${student.className}</p>
              <p class="meta-line">Guardian: ${student.guardianName || 'Not provided'}</p>
              <p class="meta-line">Contact: ${student.contact || 'Not provided'}</p>
            </div>
            <span class="amount-pill">${outStanding > 0 ? 'Outstanding' : 'Up to date'}</span>
          </div>

          <div class="student-metrics">
            <div class="metric-box">
              <span>Fees due</span>
              <strong>${formatCurrency(totalFees)}</strong>
            </div>
            <div class="metric-box">
              <span>Paid</span>
              <strong>${formatCurrency(totalPaid)}</strong>
            </div>
            <div class="metric-box">
              <span>Balance</span>
              <strong>${formatCurrency(outStanding)}</strong>
            </div>
          </div>

          <div class="card-actions">
            <button class="secondary-btn" type="button" data-student-export="${student.id}">Export PDF</button>
            ${latestFee ? `<small>Next due: ${new Date(latestFee.dueDate).toLocaleDateString('en-GB')}</small>` : '<small>No fees assigned</small>'}
          </div>
        </article>
      `;
    })
    .join('');

  document.querySelectorAll('[data-student-export]').forEach((button) => {
    button.addEventListener('click', (event) => {
      const studentId = event.currentTarget.dataset.studentExport;
      exportStudentPdf(studentId);
    });
  });
}

function renderPaymentHistory() {
  const recentPayments = [...state.payments].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!recentPayments.length) {
    ui.paymentHistory.innerHTML = '<div class="empty-state">No payment records yet.</div>';
    return;
  }

  ui.paymentHistory.innerHTML = recentPayments
    .slice(0, 8)
    .map((payment) => {
      const student = getStudentById(payment.studentId);
      const fee = getFeeById(payment.feeId);
      return `
        <div class="history-item">
          <div>
            <strong>${student ? student.fullName : 'Unknown student'}</strong>
            <small>${fee ? fee.category : 'General payment'} • ${new Date(payment.date).toLocaleDateString('en-GB')}</small>
          </div>
          <div class="amount-pill">${formatCurrency(payment.amount)}</div>
        </div>
      `;
    })
    .join('');
}

function handleStudentSubmit(event) {
  event.preventDefault();

  const formData = new FormData(ui.studentForm);
  const newStudent = {
    id: generateId('student'),
    fullName: formData.get('name').toString().trim(),
    className: formData.get('className').toString().trim(),
    guardianName: formData.get('guardian').toString().trim(),
    contact: formData.get('contact').toString().trim()
  };

  if (!newStudent.fullName || !newStudent.className) {
    return;
  }

  state.students.push(newStudent);
  saveState();
  ui.studentForm.reset();
  render();
}

function handleFeeSubmit(event) {
  event.preventDefault();

  const formData = new FormData(ui.feeForm);
  const studentId = formData.get('studentId');
  const amount = Number(formData.get('amount'));

  if (!studentId || !amount || amount <= 0) {
    return;
  }

  const newFee = {
    id: generateId('fee'),
    studentId,
    category: formData.get('category').toString().trim(),
    amount,
    dueDate: formData.get('dueDate').toString(),
    status: 'active'
  };

  state.fees.push(newFee);
  saveState();
  ui.feeForm.reset();
  render();
}

function handlePaymentSubmit(event) {
  event.preventDefault();

  const formData = new FormData(ui.paymentForm);
  const studentId = formData.get('studentId');
  const feeId = formData.get('feeId');
  const amount = Number(formData.get('amount'));

  if (!studentId || !amount || amount <= 0) {
    return;
  }

  const newPayment = {
    id: generateId('pay'),
    studentId,
    feeId: feeId || null,
    amount,
    method: formData.get('method').toString(),
    notes: formData.get('notes').toString().trim(),
    date: new Date().toISOString().slice(0, 10)
  };

  state.payments.push(newPayment);
  saveState();
  ui.paymentForm.reset();
  render();
}

function render() {
  renderSummary();
  renderSelectors();
  renderStudentList();
  renderPaymentHistory();
}

function exportSummaryPdf() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('PDF library is unavailable.');
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('Ghana School Fees Summary', 14, 18);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, 14, 26);

  const totalDue = state.fees.reduce((sum, fee) => sum + Number(fee.amount || 0), 0);
  const totalPaid = state.payments.reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
  const totalOutstanding = totalDue - totalPaid;

  doc.text(`Students: ${state.students.length}`, 14, 40);
  doc.text(`Total Fees Due: ${formatCurrency(totalDue)}`, 14, 48);
  doc.text(`Total Paid: ${formatCurrency(totalPaid)}`, 14, 56);
  doc.text(`Outstanding: ${formatCurrency(totalOutstanding)}`, 14, 64);

  let y = 82;
  doc.setFontSize(11);
  doc.text('Student balances', 14, y);
  y += 8;

  state.students.forEach((student) => {
    const feeTotal = getTotalFeesForStudent(student.id);
    const paymentTotal = getTotalPaymentsForStudent(student.id);
    const balance = feeTotal - paymentTotal;
    doc.text(`${student.fullName} - ${student.className}: ${formatCurrency(balance)} outstanding`, 14, y);
    y += 8;
  });

  doc.save('ghana-school-fees-summary.pdf');
}

function exportStudentPdf(studentId) {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    alert('PDF library is unavailable.');
    return;
  }

  const student = getStudentById(studentId);
  if (!student) {
    return;
  }

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  doc.setFontSize(18);
  doc.text('School Fee Statement', 14, 18);
  doc.setFontSize(11);
  doc.text(`Student: ${student.fullName}`, 14, 30);
  doc.text(`Class: ${student.className}`, 14, 38);
  doc.text(`Guardian: ${student.guardianName || 'Not provided'}`, 14, 46);
  doc.text(`Contact: ${student.contact || 'Not provided'}`, 14, 54);

  let y = 70;
  doc.text('Fee breakdown', 14, y);
  y += 8;

  const fees = state.fees.filter((fee) => fee.studentId === studentId);
  if (!fees.length) {
    doc.text('No fees assigned yet.', 14, y + 8);
  } else {
    fees.forEach((fee) => {
      const paid = state.payments
        .filter((payment) => payment.studentId === studentId && (payment.feeId === fee.id || !payment.feeId))
        .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);
      const balance = Number(fee.amount || 0) - paid;
      doc.text(`${fee.category}: ${formatCurrency(fee.amount)} | Paid: ${formatCurrency(paid)} | Balance: ${formatCurrency(balance)}`, 14, y);
      y += 8;
    });
  }

  doc.save(`${student.fullName.replace(/\s+/g, '-').toLowerCase()}-fees-statement.pdf`);
}

ui.studentForm.addEventListener('submit', handleStudentSubmit);
ui.feeForm.addEventListener('submit', handleFeeSubmit);
ui.paymentForm.addEventListener('submit', handlePaymentSubmit);
ui.paymentStudentSelect.addEventListener('change', () => {
  const studentId = ui.paymentStudentSelect.value;
  const studentFees = getStudentFeeOptions(studentId);
  const options = studentFees
    .map((fee) => `<option value="${fee.id}">${fee.category} - ${formatCurrency(fee.amount)}</option>`)
    .join('');
  ui.feeIdSelect.innerHTML = `<option value="">General payment</option>${options}`;
});
ui.exportSummaryPdf.addEventListener('click', exportSummaryPdf);

render();

if (!state.students.length && !state.fees.length && !state.payments.length) {
  state.students = demoData.students;
  state.fees = demoData.fees;
  state.payments = demoData.payments;
  saveState();
  render();
}
