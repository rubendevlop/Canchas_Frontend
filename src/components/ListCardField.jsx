import CardField from './CardField';
import canchatechada  from "../assets/canchatechada.webp"
import { useState } from 'react';
import ReserveModal from './ReserveModal';

const courts = [
  {
    id: 1,
    name: "Cancha 1 - Techada",
    type: "Futbol 5",
    surface: "Césped Sintético",
    cover: "Techada",
    price: "22.000",
    image: canchatechada
  },
  {
    id: 2,
    name: "Cancha 2",
    type: "Futbol 5",
    surface: "Césped Sintético",
    cover: "Exterior",
    price: "18.000",
    image: canchatechada
  },
   {
    id: 3,
    name: "Cancha 2",
    type: "Futbol 5",
    surface: "Césped Sintético",
    cover: "Exterior",
    price: "18.000",
    image: canchatechada
  },
   {
    id: 4,
    name: "Cancha 2",
    type: "Futbol 5",
    surface: "Césped Sintético",
    cover: "Exterior",
    price: "18.000",
    image: canchatechada
  }
];


const ListCardField = () => {
  const [selectedCourt, setSelectedCourt] = useState(null);
  return (
    <div className="container px-4">
         <div className="row">
           {courts.map((court) => (
             <CardField key={court.id} court={court}  openModal={() => setSelectedCourt(court)}/>
           ))}
         </div>
          {selectedCourt && (
        <ReserveModal
          court={selectedCourt}
          closeModal={() => setSelectedCourt(null)}
        />
      )}
       </div>
   
  )
}

export default ListCardField

