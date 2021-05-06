import './App.css';
import {useState} from 'react';

function App() {
  const [pin, changepin] = useState('');
  const [centerobj, setcenterobj] = useState([]);
  const [msg, setmsg] = useState('');
  const [loading, setloading] = useState(false);
  const clickhandler = () => {
    setloading(true);
    setTimeout(() => {
        if (pin === '') {
          setmsg('Enter Pin code');
          setcenterobj([]);
          setloading(false);
          return false;
        }

        var dt = new Date().toJSON().slice(0,10).replace(/-/g,'/');
        var dt_arr = dt.split('/');
        var today_dt = dt_arr[2] + '-' + dt_arr[1] + '-' + dt_arr[0];

        let url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=${pin}&date=${today_dt}`;
        fetch(url)
        .then(res => res.json())
        .then((rows) => {
            console.log(rows);
            if (rows.error) {
              setmsg(rows.error);
              setcenterobj([]);
            } else {
              if (rows.centers.length) {
                setcenterobj(rows.centers);
                setmsg('');
              } else {
                setmsg('No Centers on entered pincode');
                setcenterobj([]);
              }
            }
            setloading(false);
        });
      }, 3000);
  }
  return (
    <div className="App col-12">
      <h3>Covid-19 Vaccine Availability:</h3><br />
      <label className="col-3 float-left"><h5>Enter Pincode</h5></label> <input className="form-control col-3 float-left mr-2" type="text" onChange={(e) => changepin(e.target.value)} />
      <button className="btn btn-primary col-1 float-left" onClick={clickhandler}>Submit</button>
      
      <div style={{'clear':'both'}}></div>
      <hr />
      {loading ? <div style={{'color': 'red'}}><img src='731.gif' alt="loading" /><h4>Loading...Please wait</h4></div> : 
        <>{msg !== '' ? <div className="alert alert-danger"><b>{msg}</b></div> : ''}
        <Centercomp centerobj={centerobj} />
        </>
      }
    </div>
  );
}

function Centercomp(props) {
  var centerArr = [];
  let counter = 1;
  var months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  for(var i of props.centerobj) {
    var session_arr = [];
    for (var j of i.sessions) {      
      var new_date_arr = j.date.split('-');
      var month_str = new_date_arr[1].charAt(0);
      if (month_str === '0') {
        month_str = new_date_arr[1].charAt(1);
      }
      var new_date = new_date_arr[0] + ' ' + months[month_str].toUpperCase() + ' ' + new_date_arr[2];
      session_arr.push(<td key={j.session_id}><div style={{'border': '1px #000 solid', 'padding':'5px', 'marginRight':'5px'}}><b>{new_date}</b><br/>{j.available_capacity === 0 ? <span className="slot_available slot_booked">Booked</span> : <span className="slot_available">{j.available_capacity}</span>}<span>{j.vaccine}</span><br/><span className="red">Age {j.min_age_limit}+</span></div></td>);
    }
    centerArr.push(<tr key={i.address}><td><b>{counter}.{i.name}</b><br />({i.address}, {i.district_name}, {i.state_name}, {i.pincode})</td><td><table><tr>{session_arr}</tr></table></td></tr>);
    counter++;
  }
  return(
    <div><table cellSpacing="0" cellPadding="5" >{centerArr}</table></div>
  );
}

export default App;


