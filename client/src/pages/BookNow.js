import React, { useEffect, useState } from 'react'
import { HideLoading, ShowLoading } from '../redux/alertsSlice';
import { Col, Row, message } from 'antd';
import { useDispatch } from 'react-redux';
import { axiosInstance } from '../helpers/axiosInstance';
import { useParams } from 'react-router-dom';

function BookNow() {
    const params = useParams();
    const dispatch = useDispatch();
    const [bus, setBus] = useState([]);

    const getBus = async () => {
        try {
          dispatch(ShowLoading());
          const response = await axiosInstance.post("/api/buses/get-bus-by-id", {
            _id: params.id,
          });
          dispatch(HideLoading());
          if (response.data.success) {
            setBus(response.data.data);
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          dispatch(HideLoading());
          message.error(error.message);
        }
      };

    useEffect(() => {
        getBus();
      }, []);

  return (
    <div>{bus && (
        <Row className="mt-3" gutter={[30, 30]}>
          <Col lg={12} xs={24} sm={24}>
            <h1 className="text-2xl primary-text">{bus.name}</h1>
            <h1 className="text-md">
              {bus.from} - {bus.to}
            </h1>
            <hr />

            <div className="flex flex-col gap-2">
              <p className="text-md">
                Jourey Date : {bus.journeyDate}
              </p>
              <p className="text-md">
                Fare : ₹ {bus.fare} /-
              </p>
              <p className="text-md">
                Departure Time : {bus.departure}
              </p>
              <p className="text-md">
                Arrival Time : {bus.arrival}
              </p>
              </div>
            </Col>
        </Row>
  )
}
</div>
  );
}

export default BookNow