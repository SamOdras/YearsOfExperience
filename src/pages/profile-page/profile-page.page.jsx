import React, { useState, useEffect, useCallback } from 'react';
import "./profile-page.styles.scss"

const defaultImage =
  "https://images.pexels.com/photos/1037995/pexels-photo-1037995.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500";
const ProfilePage = (props) => {
  const { payload, setNotification } = props;
  const { jobExperienceValue, jobExperienceKey } = payload;

  const [toggleProfilePage, setToggleProfilePage] = useState("aboutMe")
  const [isShareProfileDisabled, setIsShareProfileDisabled] = useState(false);

  const setViewClassName = id => {
    if (id === toggleProfilePage) return "btn btn-secondary"
    else return "btn"
  }

  const checkValue = useCallback(() => {
    let data = Object.values(payload);
    let result = true;
    while (data.length !== 0) {
      let value = data.pop();
      if (value === "" || value === null || value === undefined) {
        result = false;
        break;
      }
      if (typeof value === 'object') {
        data = [...data, ...Object.values(value)]
      }
    }
    if(!result && payload.isPrivate === false){
      setIsShareProfileDisabled(true)
      setNotification({
        message: "Data is incompleted, button share link is disabled",
        status: "Warning",
        icon: "warning"
      })
    }
  }, [payload, setNotification])
  useEffect(() => {
    checkValue();
  }, [checkValue]);

  const generateUrlShareProfile = (id = "") => {
    let value = `${window.location.origin}/${id || ""}`;
    navigator.clipboard.writeText(value);
  }

  const selectRender = () => {
    if (toggleProfilePage !== "aboutMe") {
      return (
      <>
          {jobExperienceValue && Object.values(jobExperienceValue).length !== 0 && jobExperienceKey && jobExperienceKey.map((item, key) => {
            return (
              <div key={item} style={{ paddingLeft: '30px' }}>
                <div className="d-flex align-items-start">
                  <div>
                    <img
                      alt="This is an some"
                      src={jobExperienceValue[item].companyLogo || defaultImage}
                      className="img"
                      style={{ height: '50px', width: '50px' }}
                    />
                  </div>

                  <div
                    style={{ marginLeft: "10px" }}
                    className="pl-sm-4 pl-2"
                    id="img-section"
                    alt="this is some"
                  >
                    <h5>{`${jobExperienceValue[item].jobTitle || "Job Title"} - ${jobExperienceValue[item].company || "Company"}`}</h5>
                    <p>{`${jobExperienceValue[item].firstDate.split("-")[0] || "First Date"} - ${jobExperienceValue[item].endDate.split("-")[0] || "End Date"}`}</p>
                  </div>
                </div>
                <p>{jobExperienceValue[item].jobDescription || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Culpa doloremque iure cupiditate sint inventore, tempore harum omnis praesentium necessitatibus deserunt vero a quam quibusdam? Reprehenderit adipisci ipsa magni totam nulla."}</p>
                {key + 1 !== jobExperienceKey.length && <div className="border-bottom" ></div>}
                <div style={{ textAlign: 'center', marginBottom:'30px' }}>
                  {key === jobExperienceKey.length - 1 && payload && payload.isPrivate === false && <button className="btn btn-primary mt-3 mb-3" onClick={() => generateUrlShareProfile(payload.idUser)} disabled={isShareProfileDisabled}>{isShareProfileDisabled ? "Data is incomplete, button is disabled" : "Share This Profile"}</button>}
                </div>
              </div>
            )
          })}
      </>)
    } else {
      return (
          <div style={{ textAlign: 'center' }}>
          <img alt="this is some" className="img" style={{ width: '150px', height: '150px' }} src={(payload && payload.profileImage) ||defaultImage} />
          <h3 style={{ marginTop: "20px" }}>{(payload && payload.firstName && payload.lastName && `${payload.firstName} ${payload.lastName}`) || "Your Name"}</h3>
          <h6 style={{ color: 'grey', marginBottom: '20px' }}>{(payload && payload.emailAddress) || "youremail@email.com"}</h6>
          <p>{(payload && payload.aboutMe) || "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam quod ducimus, quas laboriosam distinctio id perferendis"}</p>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <a href={(payload && payload.linkedinLink) ||"https://linkedin.com"} target="__blank" className="btn btn-icon">
                <i className="fa fa-linkedin"></i>
              </a>
              <a href={(payload && payload.githubLink) || "https://github.com"} target="__blank" className="btn btn-icon">
                <i className="fa fa-github"></i>
              </a>
            </div>

          {payload && payload.isPrivate === false && <button className="btn btn-primary mt-3 mb-3 " onClick={() => generateUrlShareProfile(payload.idUser)} disabled={isShareProfileDisabled}>{isShareProfileDisabled ? "Data is incomplete, button is disabled" : "Share This Profile"}</button>}
          </div>
      )
    }
  }
  return (
    <div className="wrapper bg-white mt-sm-4" style={{marginBottom:'50px'}}>
      <div className="border-bottom" style={{ display: 'flex', justifyContent: 'center', marginBottom: '30px', paddingBottom: '20px' }}>
        <button style={{ marginRight: '20px' }} onClick={() => setToggleProfilePage("aboutMe")} className={setViewClassName("aboutMe")}>About Me</button>
        <button onClick={() => setToggleProfilePage("workingExperience")} className={setViewClassName("workingExperience")}>Working Experience</button>
      </div>
      {selectRender()}
    </div>
  )
}

export default ProfilePage