import HeroField from "../../components/HeroField"
import ListCardField from "../../components/ListCardField"

import "../../css/fields.css"



const Fields = () => {
  return (
    <div>
      <HeroField />
      <section className="section-fields">
        <div className="fields-heading container">
          <span className="fields-kicker">Reservas simples</span>
          <h2 className="title">Nuestras canchas</h2>
          <p className="fields-subtitle">
            Elegí la cancha ideal, revisá el precio por hora y reservá en pocos pasos.
          </p>
        </div>
        <ListCardField />
      </section>
    </div>
  );
};

export default Fields;
