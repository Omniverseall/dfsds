import  { useContext, useEffect, useState, useCallback } from 'react'
import { useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import ReletedDoctors from '../component/ReletedDoctors';

const Appointment = () => {
  const {docId} =useParams();
  const {doctors} = useContext(AppContext);
  const [docInfo,setDocInfo] = useState(null);
  const [docSlot,setDocSlot] =useState([])
  const [slotIndex,setSlotIndex] =useState(0)
  const {slotTime,setSlotTime} = useState('')

  const daysOfWeek = ["SAT",'SUN',"MON","TUE","WED","THU","FRI"]


  const fetchDocInfo = useCallback(async () => {
    const docInfo = doctors.find(doc => doc._id === docId)
    setDocInfo(docInfo)
  }, [doctors, docId]);

  const getAvilableSlot = async () => {
    setDocSlot([]);

    // geeting current date 
    let today = new Date();
    for(let i=0;i<7;i++){
      // getting date with index 
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      // setting end time of the date with index 
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21,0,0,0); 
      // seting houres 

      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10)
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30:0)
      }else{
        currentDate.setHours(10)
        currentDate.setMinutes(0)
      }
      let timeSlots = [];
      while(currentDate<endTime){
        let formattedTime = currentDate.toLocaleTimeString([],{hour:'2-digit', minute:'2-digit'})
        // add slot to array 
        timeSlots.push({
          datetime: new Date(currentDate),
          time: formattedTime
        })
        currentDate.setMinutes(currentDate.getMinutes() + 30)
      }
      setDocSlot(prev => ([...prev, timeSlots]))
    }

  }

  useEffect(()=>{
    fetchDocInfo()
  },[doctors,docId, fetchDocInfo])

  useEffect(()=>{
    getAvilableSlot();
  },[docInfo])

  useEffect(()=>{
    console.log(docSlot)
  }, [docSlot])

  return docInfo &&  (
    <div>
      {/* Doctor details  */}
      <div className=' flex flex-col sm:flex-row gap-4'>
        <div>
          <img className=' bg-primary w-full sm:max-w-72
           rounded-lg' src={docInfo.image} alt="" />
        </div>

        {/* about doc  */}
        <div className=' flex-1 border border-gray-400 rounded-lg
         p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px]
          sm:mt-0'>
          <p className=' flex items-center gap-2 text-2xl
           font-medium text-gray-900'>{docInfo.name}
            <img className=' w-5' src={assets.verified_icon} alt="" />
          </p>
          <div className=' flex items-center gap-2 text-sm mt-1
           text-gray-600'>
            <p>{docInfo.degree} - {docInfo.speciality}</p>
            <button className=' py-0.5 px-2 border
             text-sm rounded-full'>{docInfo.experience}</button>
          </div>
          <div >
            <p className=' flex items-center gap-1 text-sm
           text-gray-900 mt-3 font-medium'>About <img src={assets.info_icon} alt="" /></p>
            <p className=' text-sm text-gray-500
             max-w-[700px] mt-1'>{docInfo.about}</p>
          </div>
          <p className=' text-gray-500 font-medium
           mt-4'>Appointment Fee: <span className=' font-extrabold'>${docInfo.fees}</span></p>
        </div>
      </div>

      {/* Booking slots  */}
      <div className=' sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-900'>
        <p>Booking slots</p>
        <div className=' flex gap-3 items-center w-full overflow-x-scroll mt-4'>
          {
            docSlot.length && docSlot.map((item,index)=>(
            <div
            onClick={()=>setSlotIndex(index)}
             key={index}
            className={` text-center py-6 min-w-16 rounded-full
               cursor-pointer ${slotIndex === index ?" bg-primary text-white":" border border-gray-900"}`}
            >
              <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
              <p>{item[0] && item[0].datetime.getDate()}</p>
            </div>
            ))
          }
        </div>

        <div className=' flex items-center gap-3 w-full
         overflow-x-scroll mt-4'>
          {
            docSlot.length && docSlot[slotIndex].map((item,index)=>(
              <p key={index}
              onClick={()=>setSlotTime(item.time)}
              className={` text-sm font-light flex-shrink-0 px-5
                 py-3 rounded-full cursor-pointer
                 ${item.time === slotTime ? "bg-primary text-white":" text-gray-400 border"}`}
              >
                {item.time.toLowerCase()}

              </p>
            ))
          }
        </div>
        <button className=' bg-primary text-white text-sm
         font-light px-4 py-3 rounded-full my-6'>Book an appointment</button>
      </div>
      <ReletedDoctors 
      docId={docId}
      speciality={docInfo.speciality}
      />
    </div>
  )
}

export default Appointment
