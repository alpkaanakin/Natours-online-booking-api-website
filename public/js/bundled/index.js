const t=()=>{const e=document.querySelector(".alert");e&&e.parentElement.removeChild(e)},s=(e,s)=>{t();const a=`<div class="alert alert--${e}">${s}</div>`;document.querySelector("body").insertAdjacentHTML("afterbegin",a),window.setTimeout(t,5e3)},a=async(e,t)=>{try{const a="password"===t?"/api/users/updatepassword":"/api/users/updateMe",o=await axios({method:"PATCH",url:a,data:e});console.log(e),"success"===o.data.status&&(s("success",`${t.toUpperCase()} updated successfully!`),location.reload(!0))}catch(e){s("error",e.response.data.message)}},o=document.getElementById("map"),n=document.querySelector(".form--login"),r=document.querySelector(".form--sign-up"),d=document.querySelector(".nav__el--logout"),c=document.querySelector(".form-user-data"),u=document.querySelector(".form-user-password"),l=document.querySelector("#book-tour");if(o){(e=>{mapboxgl.accessToken="pk.eyJ1IjoiYmx1ZS1tYWdpc3RlciIsImEiOiJjbDF4ejluMngwN3N6M2NucjI1ejM2czFjIn0.PbZCOpY4YJwANReSDDC72w";var t=new mapboxgl.Map({container:"map",style:"mapbox://styles/blue-magister/cl20p5gef009h14nuj5pnvikk",scrollZoom:!1});const s=new mapboxgl.LngLatBounds;e.forEach((e=>{const a=document.createElement("div");a.className="marker",new mapboxgl.Marker({element:a,anchor:"bottom"}).setLngLat(e.coordinates).addTo(t),new mapboxgl.Popup({offset:30}).setLngLat(e.coordinates).setHTML(`<p>Day ${e.day}: ${e.description}</p>`).addTo(t),s.extend(e.coordinates)})),t.fitBounds(s,{padding:{top:200,bottom:150,left:100,right:100}})})(JSON.parse(o.dataset.locations))}n&&n.addEventListener("submit",(e=>{e.preventDefault();(async(e,t)=>{try{"success"===(await axios({method:"POST",url:"/api/users/login",data:{email:e,password:t}})).data.status&&(s("success","Logged in successfully!"),window.setTimeout((()=>{location.assign("/")}),1500))}catch(e){s("error",e.response.data.message)}})(document.getElementById("email").value,document.getElementById("password").value)})),r&&r.addEventListener("submit",(t=>{t.preventDefault();(async(t,a,o,n)=>{try{"success"===(await(r=e,r&&r.__esModule?r.default:r)({method:"POST",url:"/api/users/signup",data:{email:t,name:a,password:o,passwordConfirm:n}})).data.status&&(s("success","Logged in successfully!"),window.setTimeout((()=>{location.assign("/")}),1500))}catch(e){s("error",e.response.data.message)}var r})(document.getElementById("email").value,document.getElementById("username").value,document.getElementById("password").value,document.getElementById("password-confirm").value)})),d&&d.addEventListener("click",(async()=>{try{(await axios({method:"GET",url:"/api/users/logout"})).data.status="success",location.reload(!0)}catch(e){s("error","Error logging out! Try again.")}})),c&&c.addEventListener("submit",(e=>{e.preventDefault();const t=new FormData;t.append("photo",document.getElementById("photo").files[0]),a(t,"data")})),u&&u.addEventListener("submit",(async e=>{e.preventDefault(),document.querySelector(".btn--save-password").textContent="Updating...";const t=document.getElementById("password-current").value,s=document.getElementById("password").value,o=document.getElementById("password-confirm").value;await a({currentPassword:t,password:s,passwordConfirm:o},"password"),document.querySelector(".btn--save-password").textContent="Save password",document.getElementById("password-current").value="",document.getElementById("password").value="",document.getElementById("password-confirm").value=""})),l&&l.addEventListener("click",(e=>{e.target.textContent="Processing....";const{tourId:t}=e.target.dataset;(async e=>{try{const t=Stripe("pk_test_51KsGGVAnKHqafT4Bs5ZFe7xKsJdr0FmJaX6ro5JZb9v7kYLCSuasQ1MtRuMnGFOy2daE7MzbDRifvxf58LQRaFUT00SbeoSdn3"),s=await axios(`/api/booking/checkout-session/${e}`);await t.redirectToCheckout({sessionId:s.data.session.id})}catch(e){console.log(e),s("error",e)}})(t)}));
//# sourceMappingURL=index.js.map
