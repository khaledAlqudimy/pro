document.addEventListener('DOMContentLoaded', async () => {
  await Api.loadCatalogData();
  renderProductGrid('featuredGrid', PRODUCTS.slice(0, 4));
  renderAuctionGrid('homeAuctionGrid', AUCTIONS.filter(a => a.status === 'live').slice(0, 3));
  document.addEventListener('langchange', () => {
    renderProductGrid('featuredGrid', PRODUCTS.slice(0, 4));
    renderAuctionGrid('homeAuctionGrid', AUCTIONS.filter(a => a.status === 'live').slice(0, 3));
  });
});
