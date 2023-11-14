import React, { useEffect, useState } from "react";


import { AdminLayout } from "@layout";
import { useRouter } from "next/router";

import Calendar from "../../../components/Calendar";

const RoomReservations = () => {
  const router = useRouter();
  const { id } = router.query;
  
  return (
    <AdminLayout>
      <Calendar id={id}/>
    </AdminLayout>
  );
};

export default RoomReservations;
