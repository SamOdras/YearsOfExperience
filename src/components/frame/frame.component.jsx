import "bootstrap/dist/css/bootstrap.min.css";
import "../../pages/main-page/main-page.styles.scss";

import firebase from "../../firebase";
import { Toast, ToastHeader, ToastBody, Dropdown, DropdownItem, DropdownMenu } from "reactstrap";
import React, { useState, useEffect, useCallback, } from "react";

const auth = firebase.auth();
const googleProvider = new firebase.auth.GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });

function Frame(props) {
  const {
    setNotification,
    notificationMessage,
    notificationStatus,
    notificationIcon,
    setIdUser,
    idUser,
    toggleView,
    setToggleView,
    resetData
  } = props;
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);


  const handleCloseNotification = useCallback(() => {
    let payload = {
      message: "",
      status: "",
      icon: ""
    };
    setNotification(payload);
  }, [setNotification]);

  useEffect(() => {
    setTimeout(() => {
      handleCloseNotification()
    }, 7000);
  }, [
    notificationStatus,
    notificationMessage,
    notificationIcon,
    handleCloseNotification
  ]);

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setIdUser({
          uid: user.uid,
          displayName: user.displayName
        });
      }
    });
  }, [setIdUser]);

  const handleSignOut = () => {
    auth.signOut()
      .then(() => {
        setIdUser({
          uid: "",
          displayName: ""
        })
        resetData();
        window.location.reload();
      })

  }

  const handleSignIn = () => {
    auth.signInWithPopup(googleProvider)
      .catch(e => {
        setNotification({
          message: "Failed to login",
          status: "Failed",
          icon: "danger"
        });
      }) 
  }

  const handleDisplayName = (name = "") => {
    if(name === "") return name
    if(name.length > 15) name = name.slice(0, 15) + "..."
    return name
  }

  const handleClassName = (name) => {
    if (name === toggleView) return "btn btn-secondary"
    else return "btn"
  }
  return (
    <>
      {notificationMessage && (
        <div
          style={{ position: "fixed", bottom: 0, left: 0 }}
          className="p-3 my-2 rounded"
        >
          <Toast>
            <ToastHeader
              toggle={() => handleCloseNotification()}
              icon={notificationIcon}
            >
              {notificationStatus}
            </ToastHeader>
            <ToastBody>{notificationMessage}</ToastBody>
          </Toast>
        </div>
      )}

      <div className="wrapper bg-white mt-sm-5">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div>
            <button className={handleClassName("preview")} onClick={() => setToggleView("preview")}>Preview Profile</button>
            <button className={handleClassName("edit")} onClick={() => setToggleView("edit")}>Edit Profile</button>
          </div>
          <div>
            {(idUser === "" || (idUser && idUser.uid === "")) && (
              <>
                <button
                  style={{ marginRight: "7px" }}
                  className="btn btn-outline-primary"
                  onClick={() => handleSignIn()}
                >
                  Login
                </button>
              </>
            )}
            {idUser && idUser.uid !== "" && (
              <>
                <Dropdown
                  isOpen={isDropdownVisible}
                  toggle={() => setIsDropdownVisible(!isDropdownVisible)}
                >
                  {" "}
                  <button
                    style={{ marginRight: "7px" }}
                    className="btn btn-outline-primary"
                    onClick={() => setIsDropdownVisible(!isDropdownVisible)}
                  >
                    {handleDisplayName(idUser.displayName)}
                  </button>
                  <DropdownMenu style={{ marginTop: "40px" }}>
                    <DropdownItem onClick={() => handleSignOut()}>
                      Sign Out
                    </DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </>
            )}
          </div>
        </div>
      </div>
      {props.children}
    </>
  );
}

export default Frame;
