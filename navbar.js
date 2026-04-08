// Navbar Component
function loadNavbar() {
  const navbar = `
    <div style="
      width: 100%;
      padding: 10px;
      background: #4a90e2;
      color: white;
      text-align: center;
      font-weight: bold;
      position: fixed;
      top: 0;
      left: 0;
    ">
      🛡️ SafeSpace
    </div>
  `;

  document.body.insertAdjacentHTML("afterbegin", navbar);
}