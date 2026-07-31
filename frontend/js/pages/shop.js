document.addEventListener('DOMContentLoaded', async () => {
  await Api.loadCatalogData();

  let activeCats = [];
  const params = new URLSearchParams(location.search);
  if (params.get('cat')) { activeCats = [params.get('cat')]; }

  function applyFilters() {
    let items = PRODUCTS.filter(p => {
      const catOk = activeCats.length === 0 || activeCats.includes(p.category) || activeCats.includes(p.categorySlug);
      const priceOk = p.price <= Number(document.getElementById('priceRange').value);
      const availOk = !document.getElementById('onlyAvailable').checked || p.stock > 0;
      return catOk && priceOk && availOk;
    });
    const sort = document.getElementById('sortSelect').value;
    if (sort === 'price-asc') items.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') items.sort((a, b) => b.price - a.price);
    if (sort === 'name') items.sort((a, b) => I18n.t(a, 'title').localeCompare(I18n.t(b, 'title'), I18n.current));
    document.getElementById('resultsCount').textContent =
      I18n.current === 'ar' ? `عرض ${items.length} من ${PRODUCTS.length} قطعة` : `Showing ${items.length} of ${PRODUCTS.length} pieces`;
    renderProductGrid('shopGrid', items);
  }

  document.querySelectorAll('.cat-filter').forEach(cb => {
    if (activeCats.includes(cb.value)) cb.checked = true;
    cb.addEventListener('change', () => {
      activeCats = [...document.querySelectorAll('.cat-filter:checked')].map(c => c.value);
      applyFilters();
    });
  });
  document.getElementById('priceRange').addEventListener('input', (e) => {
    const label = I18n.current === 'ar' ? `حتى ${Number(e.target.value).toLocaleString('ar-SA')} ر.س` : `Up to ${Number(e.target.value).toLocaleString('en-US')} SAR`;
    document.getElementById('priceMaxLabel').textContent = label;
    applyFilters();
  });
  document.getElementById('onlyAvailable').addEventListener('change', applyFilters);
  document.getElementById('sortSelect').addEventListener('change', applyFilters);
  document.getElementById('resetFilters').addEventListener('click', () => {
    activeCats = [];
    document.querySelectorAll('.cat-filter').forEach(c => c.checked = false);
    document.getElementById('onlyAvailable').checked = false;
    document.getElementById('priceRange').value = 42000;
    document.getElementById('priceMaxLabel').textContent = I18n.current === 'ar' ? 'حتى 42,000 ر.س' : 'Up to 42,000 SAR';
    document.getElementById('sortSelect').value = 'default';
    applyFilters();
  });

  applyFilters();
  document.addEventListener('langchange', applyFilters);
});
