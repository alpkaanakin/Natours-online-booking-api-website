const e=()=>{const e=document.querySelector(".alert");e&&e.parentElement.removeChild(e)},t=(t,s)=>{e();const a=`<div class="alert alert--${t}">${s}</div>`;document.querySelector("body").insertAdjacentHTML("afterbegin",a),window.setTimeout(e,5e3)},s=async(e,s)=>{try{const a="password"===s?"/api/users/updatepassword":"/api/users/updateMe",o=await axios({method:"PATCH",url:a,data:e});console.log(e),"success"===o.data.status&&(t("success",`${s.toUpperCase()} updated successfully!`),location.reload(!0))}catch(e){t("error",e.response.data.message)}},a=document.getElementById("map"),o=document.querySelector(".form--login"),n=document.querySelector(".form--sign-up"),r=document.querySelector(".nav__el--logout"),d=document.querySelector(".form-user-data"),c=document.querySelector(".form-user-password"),u=document.querySelector("#book-tour");if(a){(e=>{mapboxgl.accessToken="pk.eyJ1IjoiYmx1ZS1tYWdpc3RlciIsImEiOiJjbDF4ejluMngwN3N6M2NucjI1ejM2czFjIn0.PbZCOpY4YJwANReSDDC72w";var t=new mapboxgl.Map({container:"map",style:"mapbox://styles/blue-magister/cl20p5gef009h14nuj5pnvikk",scrollZoom:!1});const s=new mapboxgl.LngLatBounds;e.forEach((e=>{const a=document.createElement("div");a.className="marker",new mapboxgl.Marker({element:a,anchor:"bottom"}).setLngLat(e.coordinates).addTo(t),new mapboxgl.Popup({offset:30}).setLngLat(e.coordinates).setHTML(`<p>Day ${e.day}: ${e.description}</p>`).addTo(t),s.extend(e.coordinates)})),t.fitBounds(s,{padding:{top:200,bottom:150,left:100,right:100}})})(JSON.parse(a.dataset.locations))}o&&o.addEventListener("submit",(e=>{e.preventDefault();(async(e,s)=>{try{"success"===(await axios({method:"POST",url:"/api/users/login",data:{email:e,password:s}})).data.status&&(t("success","Logged in successfully!"),window.setTimeout((()=>{location.assign("/")}),1500))}catch(e){t("error",e.response.data.message)}})(document.getElementById("email").value,document.getElementById("password").value)})),n&&n.addEventListener("submit",(e=>{e.preventDefault();(async(e,s,a,o)=>{try{"success"===(await axios({method:"POST",url:"/api/users/signup",data:{email:e,name:s,password:a,passwordConfirm:o}})).data.status&&(t("success","Logged in successfully!"),window.setTimeout((()=>{location.assign("/")}),1500))}catch(e){t("error",e.response.data.message)}})(document.getElementById("email").value,document.getElementById("username").value,document.getElementById("password").value,document.getElementById("password-confirm").value)})),r&&r.addEventListener("click",(async()=>{try{(await axios({method:"GET",url:"/api/users/logout"})).data.status="success",location.reload(!0)}catch(e){t("error","Error logging out! Try again.")}})),d&&d.addEventListener("submit",(e=>{e.preventDefault();const t=new FormData;t.append("photo",document.getElementById("photo").files[0]),s(t,"data")})),c&&c.addEventListener("submit",(async e=>{e.preventDefault(),document.querySelector(".btn--save-password").textContent="Updating...";const t=document.getElementById("password-current").value,a=document.getElementById("password").value,o=document.getElementById("password-confirm").value;await s({currentPassword:t,password:a,passwordConfirm:o},"password"),document.querySelector(".btn--save-password").textContent="Save password",document.getElementById("password-current").value="",document.getElementById("password").value="",document.getElementById("password-confirm").value=""})),u&&u.addEventListener("click",(e=>{e.target.textContent="Processing....";const{tourId:s}=e.target.dataset;(async e=>{try{const t=Stripe("pk_test_51KsGGVAnKHqafT4Bs5ZFe7xKsJdr0FmJaX6ro5JZb9v7kYLCSuasQ1MtRuMnGFOy2daE7MzbDRifvxf58LQRaFUT00SbeoSdn3"),s=await axios(`/api/booking/checkout-session/${e}`);await t.redirectToCheckout({sessionId:s.data.session.id})}catch(e){console.log(e),t("error",e)}})(s)}));
//# sourceMappingURL=index.js.map
