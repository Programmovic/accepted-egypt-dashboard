// NotFoundPage.js
import React from "react";
import { AdminLayout } from "@layout";

const NotFoundPage = () => {
  return (
    <AdminLayout>
      <div className="text-center">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>
    </AdminLayout>
  );
};

export default NotFoundPage;
