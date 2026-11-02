/* ПОРЯДОК ПРОЕКТОВ НА ГЛАВНОЙ
   ORDER_A — «все работы»: [узкая колонка (вертикальные обложки)], [широкая колонка (горизонтальные)]
   FILTER_ORDER — ручной порядок для отдельных фильтров
   ORDER_B — порядок для остальных фильтров и для телефона */
/* «все работы» — ORDER_A (колонки разной ширины); ORDER_B — порядок для фильтров и телефона */
const ORDER_A = [["fashion-cycles","guva","film-posters","hdc-lookbook","film-app","dance-of-darkness","ne-tuzhi","city-hermitage"],
                 ["here-dot-comes","grunge-is-dead","coffee-and-cigarettes","lookbook-2025","kolybel","rep","piracy","fluent-design-toolkit","podpisnie"]];
const FILTER_ORDER = {
  photo:[["ne-tuzhi","coffee-and-cigarettes","lookbook-2025"],["hdc-lookbook","guva","city-hermitage"]],
  ad:[["dance-of-darkness","lookbook-2025"],["coffee-and-cigarettes","hdc-lookbook"]]
};
const A_RATIO = {"rep":{r:"1440/1010",cover:"img/rep/cover-wide2.jpg"}}; /* в широкой колонке вертикальная обложка показывается горизонтальным кадром */
const ORDER_B = [["fashion-cycles","grunge-is-dead","dance-of-darkness","lookbook-2025","guva","piracy","film-app","city-hermitage"],
                 ["here-dot-comes","ne-tuzhi","kolybel","coffee-and-cigarettes","hdc-lookbook","fluent-design-toolkit","rep","film-posters","podpisnie"]];
