document.addEventListener('DOMContentLoaded', async () => {
  await Api.loadCatalogData();

  function updateLiveCount() {
    document.getElementById('liveCountLabel').textContent = AUCTIONS.filter(a => a.status === 'live').length;
  }
  function renderTab(filter) {
    const items = filter === 'all' ? AUCTIONS : AUCTIONS.filter(a => a.status === filter);
    renderAuctionGrid('auctionsGrid', items);
  }

  updateLiveCount();
  document.querySelectorAll('.auction-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auction-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      renderTab(tab.dataset.filter);
    });
  });
  renderTab('all');

  document.addEventListener('langchange', () => {
    const active = document.querySelector('.auction-tab.active')?.dataset.filter || 'all';
    renderTab(active);
  });
});
