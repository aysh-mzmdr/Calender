import React, { useState, useEffect } from 'react';
import styles from './App.module.css';

const SERVER_PORT = import.meta.env.VITE_SERVER_PORT

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const COLORS = [
  { name: 'None', value: '' },
  { name: 'Red', value: 'red' },
  { name: 'Maroon', value: 'maroon' },
  { name: 'Green', value: 'green' },
  { name: 'Deep Green', value: 'deepGreen' },
  { name: 'Blue', value: 'blue' },
  { name: 'Yellow', value: 'yellow' },
  { name: 'Purple', value: 'purple' },
];

export default function Calendar() {

  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [dateData, setDateData] = useState({});
  const [modalState, setModalState] = useState({ isOpen: false, date: null });
  const [activeNote, setActiveNote] = useState('');
  const [activeColor, setActiveColor] = useState('');
  const [theme, setTheme] = useState(() => {
    const themeData = localStorage.getItem("theme")
    return themeData ? themeData : 'light'
  });                                                         

  useEffect(() => {
    localStorage.setItem("theme",theme)
  },[theme])

  useEffect(() => {
    fetch(`http://localhost:${SERVER_PORT}/api/getDates`,{credentials:'include'})
    .then(response => response.json())
    .then(data => {
      
      const tempData = {};
      data.forEach((item) => {
        tempData[item.date] = {
          note:item.note,
          color:item.color
        }
      })
      setDateData(tempData)
    })
    .catch(err => window.alert(err))
  },[])

  const getDaysInMonth = (year, month) => 
    new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year, month) => 
    new Date(year, month, 1).getDay();

  const handleDateClick = (dateStr) => {
    const existingData = dateData[dateStr] || { note: '', color: '' };
    setActiveNote(existingData.note);
    setActiveColor(existingData.color);
    setModalState({ isOpen: true, date: dateStr });
  };

  const handleSave = async() => {
    const newData = { date: modalState.date, note: activeNote, color: activeColor }
    setDateData((prev) => ({
      ...prev, [modalState.date] : {note: activeNote, color: activeColor}}));
    try{
        const response=await fetch(`http://localhost:${SERVER_PORT}/api/update`,{
            method:"POST",
            credentials:"include",
            headers:{
                "Content-type":"application/json"
            },
            body: JSON.stringify(newData)
        })
        if(!response.ok)
            throw new Error("Invalid Credentials")
    }
    catch(err){
        window.alert(err)
    }
    finally{
      console.log(newData);
      closeModal();
    }
  };

  const closeModal = () => {
    setModalState({ isOpen: false, date: null });
  };

  const formatDateLabel = (dateStr) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-');
    return `${MONTHS[parseInt(month)]} ${day}, ${year}`;
  };

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className={`${styles.calendarWrapper} ${styles[theme]}`}>
      <header className={styles.header}>
        <div className={styles.headerSpacer} />
        <div className={styles.yearControls}>
          <button onClick={() => setCurrentYear((y) => y - 1)} className={styles.navBtn}>
            &#8592;
          </button>
          <h1 className={styles.yearTitle}>{currentYear}</h1>
          <button onClick={() => setCurrentYear((y) => y + 1)} className={styles.navBtn}>
            &#8594;
          </button>
        </div>
        <button onClick={toggleTheme} className={styles.themeToggleBtn} title="Toggle Theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      <div className={styles.yearGrid}>
        {MONTHS.map((monthName, monthIndex) => {
          const daysInMonth = getDaysInMonth(currentYear, monthIndex);
          const firstDay = getFirstDayOfMonth(currentYear, monthIndex);

          return (
            <div key={monthName} className={styles.monthCard}>
              <h3 className={styles.monthTitle}>{monthName}</h3>
              <div className={styles.daysGrid}>
                {DAYS_OF_WEEK.map((day) => (
                  <div key={day} className={styles.dayOfWeek}>{day}</div>
                ))}
                
                {Array.from({ length: firstDay }).map((_, i) => (
                  <div key={`empty-${i}`} className={styles.emptyDay} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const monthNum = String(monthIndex + 1).padStart(2, '0');
                  const dayNum = String(i+1).padStart(2, '0');
                  const dateStr = `${currentYear}-${monthNum}-${dayNum}`;
                  const data = dateData[dateStr];
                  const hasNote = data?.note?.trim().length > 0;
                  const colorClass = data?.color ? styles[data.color] : '';

                  return (
                    <div
                      key={dayNum}
                      className={`${styles.dayCell} ${colorClass}`}
                      onClick={() => handleDateClick(dateStr)}
                    >
                      <span className={styles.dayNumber}>{dayNum}</span>
                      {hasNote && <div className={styles.noteIndicator} />}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {modalState.isOpen && (
        <div className={styles.modalOverlay} onClick={closeModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h2>{formatDateLabel(modalState.date)}</h2>
              <button className={styles.closeBtn} onClick={closeModal}>&times;</button>
            </div>

            <div className={styles.colorPicker}>
              <p>Label Color</p>
              <div className={styles.colorOptions}>
                {COLORS.map((c) => (
                  <button
                    key={c.name}
                    className={`${styles.colorCircle} ${styles[`bg_${c.value}`]} ${
                      activeColor === c.value ? styles.activeColor : ''
                    }`}
                    onClick={() => setActiveColor(c.value)}
                    title={c.name}
                  >
                    {c.value === '' && <span className={styles.noColorLine}>/</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className={styles.noteSection}>
              <p>Notes</p>
              <textarea
                className={styles.noteInput}
                value={activeNote}
                onChange={(e) => setActiveNote(e.target.value)}
                placeholder="Add a note for this date..."
                rows={4}
              />
            </div>

            <div className={styles.modalActions}>
              <button className={styles.cancelBtn} onClick={closeModal}>Cancel</button>
              <button className={styles.saveBtn} onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}