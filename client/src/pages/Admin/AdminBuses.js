import React, { useState } from "react";
import PageTitle from "../../components/PageTitle";
import BusForm from "../../components/BusForm";

function AdminBuses() {
  const [showBusForm, setShowBusForm] = useState(false);
  return (
    <div>
      <div className="d-flex justify-content-between my-2">
        <PageTitle title="Buses" />
        <button className="primary-btn" onClick={() => setShowBusForm(true)}>
          Add Bus
        </button>
      </div>

      {showBusForm && (
        <BusForm showBusForm={showBusForm} setShowBusForm={setShowBusForm} type="add"/>
      )}
    </div>
  );
}

export default AdminBuses;
