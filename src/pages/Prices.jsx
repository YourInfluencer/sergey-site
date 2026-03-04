export default function Prices() {
  return (
    <main>
      <section className="section">
        <div className="wrap">
          <h1 className="pageTitle">Цены</h1>
          <p className="muted">
            Точная стоимость зависит от причины неисправности и деталей. Поэтому сначала диагностика,
            потом — согласование цены. Без согласования работу не начинаем.
          </p>

          {/* Быстрые пакеты (понятно старшему поколению) */}
          <div className="priceGrid">
            <div className="priceCard">
              <div className="priceName">Консультация / мелкая настройка</div>
              <div className="priceFrom">от … ₽</div>
              <ul className="list">
                <li>подключить/настроить устройство</li>
                <li>исправить простые ошибки</li>
                <li>проверить “почему не работает”</li>
              </ul>
              <div className="muted small">Если решается быстро — выйдет дешевле.</div>
            </div>

            <div className="priceCard">
              <div className="priceName">Обслуживание</div>
              <div className="priceFrom">от … ₽</div>
              <ul className="list">
                <li>чистка, профилактика, настройка</li>
                <li>ускорение работы (если возможно)</li>
                <li>проверка после работ</li>
              </ul>
              <div className="muted small">Подходит, если “тормозит/греется/глючит”.</div>
            </div>

            <div className="priceCard">
              <div className="priceName">Ремонт</div>
              <div className="priceFrom">от … ₽</div>
              <ul className="list">
                <li>диагностика причины</li>
                <li>ремонт/замена узлов</li>
                <li>согласование деталей до покупки</li>
              </ul>
              <div className="muted small">Детали оплачиваются отдельно, если нужны.</div>
            </div>
          </div>

          {/* Таблица по направлениям */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="cardTitle">Ориентиры по работам</div>

            <div className="row"><span>Диагностика</span><b>от … ₽</b></div>
            <div className="row"><span>Настройка / обслуживание</span><b>от … ₽</b></div>
            <div className="row"><span>Ремонт / замена деталей</span><b>от … ₽</b></div>
            <div className="row"><span>Выезд по городу</span><b>от … ₽</b></div>

            <p className="muted small" style={{ marginTop: 10 }}>
              Если после диагностики ремонт нецелесообразен — скажем честно и предложим варианты.
            </p>
          </div>

          {/* Почему цена “после диагностики” */}
          <div className="card" style={{ marginTop: 12 }}>
            <div className="cardTitle">Почему цена зависит от диагностики</div>
            <ul className="list">
              <li>Одинаковые симптомы могут иметь разные причины</li>
              <li>Иногда достаточно настройки, а иногда нужна деталь</li>
              <li>Мы называем стоимость до начала работ — чтобы без сюрпризов</li>
            </ul>
          </div>

          <div className="card" style={{ marginTop: 12 }}>
            <div className="cardTitle">Как быстрее оценить по фото/сообщению</div>
            <p className="muted">
              Напишите модель устройства и что происходит (что горит/пищит/пишет на экране, после чего началось).
              Если есть фото — приложите.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}