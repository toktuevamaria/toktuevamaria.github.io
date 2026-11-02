/* ТЕКСТЫ: короткое био в левой колонке, страница «Обо мне», контакты */
/* ---------- общие блоки текста ---------- */
const BIO_SHORT = `Дизайнер, арт-директор и фотограф из Санкт-Петербурга. Создаю бренды, книги и визуальные истории, в которых есть <span class="it">смысл и чувство</span>.`;
const BIO_LONG = [
  `Я Мария Токтуева, графический дизайнер из Санкт-Петербурга, выпускница программы «Коммуникационный дизайн» НИУ ВШЭ. С детства я живу в мире кино, литературы, театра и танца — он сформировал меня и то, как я смотрю на вещи. Я всегда видела себя в творчестве, но по складу ума мне нужны план и структура. Дизайн соединил одно с другим, так я в нём и оказалась.`,
  `Каждый проект для меня — отдельная история, которую я прохожу целиком: от первой задумки до полной реализации. Дизайн многогранен и окружает нас каждый день, поэтому готового рецепта у меня нет: к каждой задаче я ищу свой подход.`,
  `О чём бы ни был проект, я начинаю с исследования: погружаюсь в культурный контекст и среду, в которой ему предстоит жить. Только так заложенная в нём мысль раскрывается полностью.`,
  `Мир слишком разнообразен, чтобы останавливаться на чём-то одном, поэтому я работаю там, где могу отдаваться делу целиком, начиная от брендинга и заканчивая фотографией. <span class="it">Открыта к проектам и постоянной работе.</span>`
];
const F = {
  dirs:`<div><span class="it lab">направления</span><ul class="plain"><li>Брендинг и айдентика</li><li>Вёрстка книг</li><li>Арт-дирекшн съёмок</li><li>Фотография</li><li>Шрифт и иллюстрация</li></ul></div>`,
  edu:`<div><span class="it lab">образование</span><ul class="plain"><li>НИУ ВШЭ</li><li>Коммуникационный дизайн</li><li>2022–2026</li></ul></div>`,
  cv:`<div><span class="it lab">резюме</span><p>Опыт, образование и навыки одним файлом.</p><a class="cv" href="Toktueva_CV.pdf" target="_blank" rel="noopener"><span>Скачать CV</span><span class="it">pdf</span></a></div>`,
  tools:`<div><span class="it lab">инструменты</span><ul class="plain"><li>Figma</li><li>InDesign, Illustrator, Photoshop, Lightroom</li><li>Blender и другие 3D-инструменты</li><li>Claude, ChatGPT, Midjourney, Recraft</li></ul></div>`,
  contacts:`<div class="contacts">
      <div class="row"><span class="k">Почта</span><a href="mailto:toktuevamaria@gmail.com"><span class="it">toktuevamaria@gmail.com</span></a></div>
      <div class="row"><span class="k">Telegram</span><a href="https://t.me/mariatoktueva" target="_blank" rel="noopener"><span class="it">@mariatoktueva</span></a></div>
      <div class="row"><span class="k">Instagram</span><a href="https://instagram.com/mariasavaseva" target="_blank" rel="noopener"><span class="it">@mariasavaseva</span></a></div>
    </div>`
};
