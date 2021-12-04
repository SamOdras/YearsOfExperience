import React, { useState, useEffect, useCallback } from 'react';
import "../profile-page/profile-page.styles.scss"
import "firebase/compat/firestore";
import firebase from "../../firebase";
import { Spinner } from "reactstrap"

const db = firebase.firestore();

const defaultImage =
  "https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
const ProfilePage = (props) => {

  const { match: { params: { id } } } = props
  // const { jobExperienceValue, jobExperienceKey } = dataProfile;

  const [toggleProfilePage, setToggleProfilePage] = useState("aboutMe")
  const [dataProfile, setDataProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);


  const setViewClassName = id => {
    if (id === toggleProfilePage) return "btn btn-secondary"
    else return "btn"
  }

  const getData = useCallback(async id => {
    setIsLoading(true)
    const referensi = db.doc(`listData/${id}`);
    try {
      const response = await referensi.get();
      if (response.exists) {
        let newData = response.data();
        if(newData.isPrivate){
          setDataProfile("private")
        } else {
          setDataProfile(response.data())
        }
      } else {
        setDataProfile("noData")
      }
    } catch (e) {
      setDataProfile("noData")
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (id) {
      getData(id);
    }
  }, [id, getData]);

  const selectRender = () => {
    if(dataProfile && dataProfile !== "noData" && dataProfile !== "private"){
      const { jobExperienceKey, jobExperienceValue } = dataProfile
      if (toggleProfilePage !== "aboutMe") {
        return (
          <>
            {jobExperienceValue && Object.values(jobExperienceValue).length !== 0 && jobExperienceKey && jobExperienceKey.map((item, key) => {
              return (
                <div key={item} style={{ paddingLeft: '30px' }}>
                  <div className="d-flex align-items-start">
                    <div>
                      <img
                        src={jobExperienceValue[item].companyLogo || defaultImage}
                        className="img"
                        style={{ height: '50px', width: '50px' }}
                        alt="This is an immage"
                      />
                    </div>

                    <div
                      style={{ marginLeft: "10px" }}
                      className="pl-sm-4 pl-2"
                      id="img-section"
                    >
                      <h5>{`${jobExperienceValue[item].jobTitle || "Job Title"} - ${jobExperienceValue[item].company || "Company"}`}</h5>
                      <p>{`${jobExperienceValue[item].firstDate.split("-")[0] || "First Date"} - ${jobExperienceValue[item].endDate.split("-")[0] || "End Date"}`}</p>
                    </div>
                  </div>
                  <p>{jobExperienceValue[item].jobDescription || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa doloremque iure cupiditate sint inventore, tempore harum omnis praesentium necessitatibus deserunt vero a quam quibusdam? Reprehenderit adipisci ipsa magni totam nulla."}</p>
                  {key + 1 !== jobExperienceKey.length && <div style={{ marginBottom: '30px'}} className="border-bottom" ></div>}
                </div>
              )
            })}
          </>)
      } else {
        return (
          <div style={{ textAlign: 'center' }}>
            <img alt="This is an immage" className="img" style={{ width: '150px', height: '150px' }} src={(dataProfile && dataProfile.profileImage) || defaultImage} />
            <h3 style={{ marginTop: "20px" }}>{(dataProfile && dataProfile.firstName && dataProfile.lastName && `${dataProfile.firstName} ${dataProfile.lastName}`) || "Your Name"}</h3>
            <h6 style={{ color: 'grey', marginBottom: '20px' }}>{(dataProfile && dataProfile.emailAddress) || "youremail@email.com"}</h6>
            <p>{(dataProfile && dataProfile.aboutMe) || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam quod ducimus, quas laboriosam distinctio id perferendis"}</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <a href={(dataProfile && dataProfile.linkedinLink) || "https://linkedin.com"} target="__blank" className="btn btn-icon">
                <i className="fa fa-linkedin"></i>
              </a>
              <a href={(dataProfile && dataProfile.githubLink) || "https://github.com"} target="__blank" className="btn btn-icon">
                <i className="fa fa-github"></i>
              </a>
            </div>
          </div>
        )
      }
    } else if(dataProfile === "private"){
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 >This Profile is private</h2 >
      </div>
    } else {
      return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 >Profile   Not Found</h2 >
      </div>
    }
  }
  return (
      <div className="wrapper bg-white" style={{marginTop:'150px'}}>
        <div>
        <div className="border-bottom" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', paddingBottom: '20px' }}>
          <button style={{ marginRight: '20px' }} onClick={() => setToggleProfilePage("aboutMe")} className={setViewClassName("aboutMe")}>About Me</button>
          <button onClick={() => setToggleProfilePage("workingExperience")} className={setViewClassName("workingExperience")}>Working Experience</button>
       </div>

        {!isLoading && selectRender()}
        {isLoading && <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Spinner size="sm" style={{ marginRight: '10px' }} />
          <h5 style={{ marginBottom: '0px' }}>Loading...</h5>
        </div>}
        </div>
        {/* {selectRender()} */}
      </div>
  )
}

export default ProfilePage