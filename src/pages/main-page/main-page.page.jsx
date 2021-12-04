// import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import "./main-page.styles.scss";
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  Input,
  Spinner,
  Label
} from "reactstrap";
import React, { useState, useEffect, useCallback } from "react";
import "firebase/compat/firestore";

import { getStorage, ref, uploadBytes, getDownloadURL  } from "firebase/storage"
import firebase from "../../firebase";
import ProfilePage from '../profile-page/profile-page.container';

const storage = getStorage();
const db = firebase.firestore();
const initrandom = new Date() + Math.random();
const defaultImage =
  "https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";


function MainPage(props) {
  const { setNotification, setDataDraft, payload, idUser, toggleView } = props;

  const [openAccordion, setOpenAccordion] = useState(initrandom);
  const [jobExperienceKey, setJobExperienceKey] = useState([initrandom]);
  const [jobExperienceValue, setJobExperienceValue] = useState({});

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [age, setAge] = useState("");
  const [githubLink, setGithubLink] = useState("")
  const [linkedinLink, setLinkedinLink] = useState("");
  const [aboutMe, setAboutMe] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);

  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [loadingUploadImage, setLoadingUploadImage] = useState("");


  const setDataProfile = payload => {
    const { age, emailAddress, firstName, lastName, profileImage, jobExperienceValue, jobExperienceKey, linkedinLink, githubLink, aboutMe, isPrivate } = payload;
    setAge(age);
    setEmailAddress(emailAddress);
    setFirstName(firstName);
    setLastName(lastName);
    setProfileImage(profileImage);
    setJobExperienceValue(jobExperienceValue);
    setJobExperienceKey(jobExperienceKey);
    setGithubLink(githubLink)
    setLinkedinLink(linkedinLink)
    setAboutMe(aboutMe)
    setIsPrivate(isPrivate)
  }
  useEffect(() => {
    if(JSON.stringify(payload) !== "{}" && !idUser){
      setDataProfile(payload)
    } 
  }, [payload, idUser])

  const getData = useCallback(async id => {
    const referensi = db.doc(`listData/${id}`);
    try {
      const response = await referensi.get();
      if (response.exists) {
        setDataProfile(response.data());
        setDataDraft(response.data())
      }
    } catch (e) {
      console.log("error");
    }
  }, [setDataDraft]);

  useEffect(() => {
    if (idUser && idUser.uid) {
      getData(idUser.uid);
    }
  }, [idUser, getData]);

  const handleUploadFile =  (file, loading, isProfileImage = true) => {
    const filePath =  `profile/${new Date() + Math.random()}.jpg`;
    const storageRef = ref(storage, filePath)
    const errorNotif = {
      message: "Failed Upload Image",
      status: "Failed",
      icon: "danger"
    }
    setLoadingUploadImage(loading)
    uploadBytes(storageRef, file)
      .then(snapshot => {
        getDownloadURL(storageRef)
          .then(url => {
            setLoadingUploadImage("")
            if (isProfileImage) setProfileImage(url);
            else return url
          })
          .catch(e => {
            setNotification(errorNotif);
            setLoadingUploadImage("")
          })
      })
      .catch(e => {
        setNotification(errorNotif);
        setLoadingUploadImage("")
      })
  }
  const handleTambahJobExperience = () => {
    let newValue = jobExperienceKey;
    newValue.push(new Date() + Math.random());
    setJobExperienceKey([...newValue]);
  };
  const handleChangeJobExperience = async (idx, fieldName, value) => {
    let newData = jobExperienceValue || {};
    newData[idx] = newData[idx] || {
      firstDate: "",
      endDate: "",
      jobTitle: "",
      company: "",
      jobDescription: "",
      companyLogo: null
    };
    if (fieldName === "companyLogo"){
      const filePath = `profile/${new Date() + Math.random()}.jpg`;
      const storageRef = ref(storage, filePath)
      const errorNotif = {
        message: "Failed Upload Image",
        status: "Failed",
        icon: "danger"
      }

      setLoadingUploadImage(idx)
      uploadBytes(storageRef, value)
        .then(snapshot => {
          getDownloadURL(storageRef)
            .then(url => {
              setLoadingUploadImage("")
              newData[idx][fieldName] = url;
              setJobExperienceValue({ ...newData });
            })
            .catch(e => {
              setNotification(errorNotif);
              setLoadingUploadImage("")
            })
        })
        .catch(e => {
          setNotification(errorNotif);
          setLoadingUploadImage("")
        })
    } else {
      newData[idx][fieldName] = value;
      setJobExperienceValue({ ...newData });
    }
    
  };
  const handleDeletePerjalanan = idx => {
    let data = jobExperienceKey;
    data = data.filter(item => item !== idx);
    setJobExperienceKey([...data]);

    let value = jobExperienceValue;
    delete value[idx];
    setJobExperienceValue(value);
  };

  const submitDataDraft = async () => {
    setLoadingSubmit(true)
    const payload = {
      firstName: firstName || "",
      lastName: lastName || "",
      emailAddress: emailAddress || "",
      age: age || "",
      profileImage: profileImage || "",
      linkedinLink: linkedinLink || "",
      githubLink: githubLink || "",
      aboutMe: aboutMe || "",
      isPrivate: isPrivate,
      jobExperienceValue: jobExperienceValue || "",
      jobExperienceKey: jobExperienceKey || "",
      idUser: "",
    };
    if (idUser && idUser.uid) {
      payload["idUser"] = idUser.uid;
      const referensi = db.doc(`listData/${idUser.uid}`);
      try {
        await referensi.set(payload);
        setTimeout(() => {
          setLoadingSubmit(false);
          setNotification({
            message: "Submit Data Success",
            status: "Success",
            icon: "success"
          });
        }, 750);
      } catch (e) {
        setTimeout(() => {
          setLoadingSubmit(false);
          setNotification({
            message: "Failed save data, data saved as draft",
            status: "Failed",
            icon: "danger"
          });
        }, 750);
      }
    } else {
      setLoadingSubmit(false);
      setNotification({
        message: "Failed save data, data saved as draft",
        status: "Failed",
        icon: "danger"
      });
    }
    setDataDraft(payload);

  };

  const handleProcessSelisihTanggal = idx => {
    let data = jobExperienceValue[idx];
    let result = "";
    if (data && data.firstDate && data.endDate) {
      let d1 = new Date(data.firstDate);
      let d2 = new Date(data.endDate);

      let tahun = d2.getFullYear() - d1.getFullYear();
      let bulan = d2.getMonth() - d2.getMonth();
      if (tahun > 0) result = `${tahun} tahun, `;
      if (bulan === 0) bulan = 1;
      result += `${bulan} bulan`;
    }
    return result;
  };
  const handleProcessTitleJobExperience = idx => {
    let difference = handleProcessSelisihTanggal(idx) || "";
    const data = jobExperienceValue[idx];
    let result = "";
    if (data) {
      if (data.company) {
        result = `${data.company}`;
        if (difference) result += ` - ${difference}`;
      }
    }
    return result;
  };

  if(toggleView === "edit"){
    return (
      <>
        <div className="wrapper bg-white mt-sm-4">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}
            className="border-bottom pb-4"
          >
            <h4 style={{ marginBottom: "0px" }}>Setup Years Experience</h4>
            <button className="btn btn-primary" disabled={loadingSubmit} onClick={submitDataDraft}>
              {loadingSubmit && <>
                <Spinner size="sm" /> Loading...
            </>}
              {!loadingSubmit && "Submit"}
            </button>
          </div>

          <div className="d-flex align-items-start py-3 border-bottom">
            <div className="pt-2">
              <img
                src={
                  profileImage ||
                  defaultImage
                }
                className="img"
                alt=""
              />
            </div>

            <div
              style={{ marginLeft: "10px" }}
              className="pl-sm-4 pl-2"
              id="img-section"
            >
              <b>Profile Photo</b>
              <p>Accepted file type .png. Less than 1MB</p>{" "}
              <input
                onChange={e => handleUploadFile(e.target.files[0], "profileImage")}
                // onChange={e => handleChangeImageProfile(e)}
                type="file"
                id="upload"
                disabled={loadingUploadImage === "profileImage"}
                hidden
              />
              <label className="btn button border" htmlFor="upload">
                {loadingUploadImage === "profileImage" && <>
                  <Spinner size="sm" /> Loading...
              </>}
                {loadingUploadImage !== "profileImage" && "Upload"}
              </label>
            </div>
          </div>
          <div className="py-2">
            <div className="row py-2">
              <div className="col-md-6">
                {" "}
                <label htmlFor="firstname">First Name</label>{" "}
                <input
                  type="text"
                  className="bg-light form-control"
                  placeholder="Steven A"
                  onChange={e => setFirstName(e.target.value)}
                  value={firstName}
                />{" "}
              </div>
              <div className="col-md-6 pt-md-0 pt-3">
                {" "}
                <label htmlFor="lastname">Last Name</label>{" "}
                <input
                  type="text"
                  className="bg-light form-control"
                  placeholder="Smith"
                  onChange={e => setLastName(e.target.value)}
                  value={lastName}
                />{" "}
              </div>
            </div>
            <div className="row py-2 ">
              <div className="col-md-6">
                {" "}
                <label htmlFor="email">Email Address</label>{" "}
                <input
                  type="email"
                  className="bg-light form-control"
                  placeholder="steve_@gmail.com"
                  onChange={e => setEmailAddress(e.target.value)}
                  value={emailAddress}
                />{" "}
              </div>
              <div className="col-md-6 pt-md-0 pt-3">
                {" "}
                <label htmlFor="phone">Age</label>{" "}
                <input
                  type="number"
                  className="bg-light form-control"
                  placeholder="19"
                  onChange={e => setAge(e.target.value)}
                  value={age}
                />{" "}
              </div>
              <div className="pt-3">
                {" "}
                <label htmlFor="firstname">About Me</label>{" "}
                <Input
                  type="textarea"
                  className="bg-light form-control"
                  placeholder="About Me..."
                  onChange={e => setAboutMe(e.target.value)}
                  value={aboutMe}
                />{" "}
              </div>
              <div className="pt-3">
                {" "}
                <label htmlFor="firstname">Github</label>{" "}
                <Input
                  type="text"
                  className="bg-light form-control"
                  placeholder="https://...."
                  onChange={e => setGithubLink(e.target.value)}
                  value={githubLink}
                />{" "}
              </div>
              <div className="pt-3">
                {" "}
                <label htmlFor="firstname">Linkedin</label>{" "}
                <Input
                  type="text"
                  className="bg-light form-control"
                  placeholder="https://...."
                  onChange={e => setLinkedinLink(e.target.value)}
                  value={linkedinLink}
                />{" "}
              </div>
              <div style={{ paddingLeft: '12px' }} className="pt-3">
                <Input type="checkbox" checked={isPrivate} onChange={e => setIsPrivate(e.target.checked)} />
                {' '}
                <Label check>
                  Check if you want to private your profile
              </Label>
              </div>
            </div>
            <div className="py-3 border-bottom"></div>
            <div className="align-items-center pt-3">
              <div style={{ width: "200px", marginBottom: "20px" }}>
                <b>Working Experience</b>
                <button
                  onClick={() => handleTambahJobExperience()}
                  className="btn btn-primary mr-3 mt-2"
                >
                  Add Work Experience
              </button>
              </div>
              <Accordion
                open={openAccordion}
                flush
                toggle={e =>
                  setOpenAccordion(prevAccordion =>
                    prevAccordion === e ? "" : e
                  )
                }
              >
                {jobExperienceKey.map((item, index) => {
                  return (
                    <AccordionItem key={index + 1}>
                      <AccordionHeader targetId={item}>
                        {handleProcessTitleJobExperience(item) ||
                          "Job Experience " + (index + 1)}
                      </AccordionHeader>
                      {openAccordion === item && (
                        <>
                          <div className="d-flex align-items-start pt-3">
                            <div className="pt-2">
                              <img
                                src={
                                  (jobExperienceValue[item] &&
                                    jobExperienceValue[item]["companyLogo"]) ||
                                  defaultImage
                                }
                                // src="https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500"
                                className="img"
                                alt=""
                              />
                            </div>

                            <div
                              style={{ marginLeft: "10px" }}
                              className="pl-sm-4 pl-2"
                              id="img-section"
                            >
                              <b>Company Logo</b>
                              <p>Accepted file type .png. Less than 1MB</p>{" "}
                              <input
                                onChange={e =>
                                  handleChangeJobExperience(
                                    item,
                                    "companyLogo",
                                    e.target.files[0]
                                  )
                                }
                                type="file"
                                id={item}
                                hidden
                              />
                              <label className="btn button border" htmlFor={item}>
                                {loadingUploadImage === item && <>
                                  <Spinner size="sm" /> Loading...
                                </>}
                                {loadingUploadImage !== item && "Upload"}
                              </label>
                              {/* <label className="btn button border" htmlFor={item}>
                              <b>Upload</b>
                            </label> */}
                            </div>
                          </div>
                          <div className="row pb-2">
                            <div className="col-md-6">
                              {" "}
                              <label htmlFor="firstname">First Date</label>{" "}
                              <input
                                type="date"
                                className="bg-light form-control"
                                placeholder="Steve"
                                onChange={e =>
                                  handleChangeJobExperience(
                                    item,
                                    "firstDate",
                                    e.target.value
                                  )
                                }
                                value={
                                  (jobExperienceValue[item] &&
                                    jobExperienceValue[item]["firstDate"]) ||
                                  ""
                                }
                              />{" "}
                            </div>
                            <div className="col-md-6 pt-md-0 pt-3">
                              {" "}
                              <label htmlFor="lastname">End Date</label>{" "}
                              <input
                                type="date"
                                className="bg-light form-control"
                                placeholder="Smith"
                                onChange={e =>
                                  handleChangeJobExperience(
                                    item,
                                    "endDate",
                                    e.target.value
                                  )
                                }
                                value={
                                  (jobExperienceValue[item] &&
                                    jobExperienceValue[item]["endDate"]) ||
                                  ""
                                }
                              />{" "}
                            </div>
                          </div>
                          <div className="row pb-2">
                            <div className="col-md-6">
                              {" "}
                              <label htmlFor="firstname">Job Title</label>{" "}
                              <input
                                type="text"
                                className="bg-light form-control"
                                placeholder="Steve"
                                onChange={e =>
                                  handleChangeJobExperience(
                                    item,
                                    "jobTitle",
                                    e.target.value
                                  )
                                }
                                value={
                                  (jobExperienceValue[item] &&
                                    jobExperienceValue[item]["jobTitle"]) ||
                                  ""
                                }
                              />{" "}
                            </div>
                            <div className="col-md-6 pt-md-0 pt-3">
                              {" "}
                              <label htmlFor="lastname">Company</label>{" "}
                              <input
                                type="text"
                                className="bg-light form-control"
                                placeholder="PT. Anugrah Sejahtra"
                                onChange={e =>
                                  handleChangeJobExperience(
                                    item,
                                    "company",
                                    e.target.value
                                  )
                                }
                                value={
                                  (jobExperienceValue[item] &&
                                    jobExperienceValue[item]["company"]) ||
                                  ""
                                }
                              />{" "}
                            </div>
                          </div>
                          <div className="row pb-3">
                            <div className="pt-2">
                              {" "}
                              <label htmlFor="lastname">
                                Job Description
                            </label>{" "}
                              <Input
                                type="textarea"
                                className="bg-light form-control"
                                placeholder="Job Description..."
                                onChange={e =>
                                  handleChangeJobExperience(
                                    item,
                                    "jobDescription",
                                    e.target.value
                                  )
                                }
                                value={
                                  (jobExperienceValue[item] &&
                                    jobExperienceValue[item]["jobDescription"]) ||
                                  ""
                                }
                              />
                            </div>
                          </div>
                          <div className="pb-3">
                            <button
                              onClick={() => handleDeletePerjalanan(item)}
                              className="btn btn-danger"
                            >
                              Delete
                          </button>
                          </div>
                        </>
                      )}
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </div>
          </div>
        </div>
      </>
    );
  } else {
    return <ProfilePage/>
  }
}

export default MainPage;
