// "use client";
// import { useEffect, useState } from "react";
// import { useAuth } from "@/context/AuthContext";
// import { fetchEmployeeNotification } from "@/app/services/notificationService";
// import { Notification } from "../app/services/notificationService";
// import Link from "next/link";
// import { encodeId } from "@/lib/hashids";

// interface NotificationListProps {
//   setNotificationLength: React.Dispatch<React.SetStateAction<number>>;
//   showFullList?: boolean; // true = show full list
// }

// const NotificationList = ({ setNotificationLength, showFullList = false }: NotificationListProps) => {
//   const { user } = useAuth();
//   const [notifications, setNotifications] = useState<Notification[]>([]);

//   const id = user?.applicant_uuid;

//   useEffect(() => {
//     const getNotifications = async () => {
//       if (!id) return;
//       try {
//         const res: Notification[] = await fetchEmployeeNotification(id);
//         console.log("Fetched notifications:", res);
//         setNotifications(res || []);
//         setNotificationLength(res?.length || 0); // update badge
//       } catch (err) {
//         console.error("Error fetching notifications:", err);
//       }
//     };

//     getNotifications();
//   }, [id, setNotificationLength]);

//   if (!showFullList) return null;

//   return (
//     <div>
//       {notifications.length === 0 ? (
//         <li className="dropdown-item text-muted">No notifications</li>
//       ) : (
//         notifications.map((n) => (
//           <li key={n.notification_id}>
//             <Link
//               className="dropdown-item"
//               href={`/employee/employeedata/${encodeId(n.form_id)}`}
//             >
//               {n.type === "new_assignment" ? "📋 A new assignment" : "💬 New comment"} <br />
//               <small className="text-muted ms-2">
//                 {new Date(n.created_at).toLocaleString()}
//               </small>
//             </Link>
//           </li>
//         ))
//       )}
//     </div>
//   );
// };

// export default NotificationList;
