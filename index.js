/* ===== EVENT DETAILS: edit everything here ===== */
const CONFIG = {
  bride: "Varshini P S",
  family: "Potham Family",
  whatsapp: "916362328291",                       // international format, digits only
  mapUrl: "https://maps.app.goo.gl/usHqkc7Z7VhUSXNj9",
  dateText: "15th November",
  timeText: "8 AM onwards",
  startISO: "2026-11-15T08:00:00+05:30",          // countdown target (India time). Check the year!
  endISO:   "2026-11-15T23:59:00+05:30",
  maxGuests: 20,
  events: [
    { id: "Chapra Pooje", k: "pooje",   time: "8 AM onwards, followed by breakfast", blurb: "A blessed beginning with prayers, flowers and family." },
    { id: "Haldi",        k: "haldi",   time: "After breakfast, followed by lunch",  blurb: "Turmeric, marigolds and plenty of laughter." }
  ]
};
const $ = id => document.getElementById(id);
$("eyebrow").textContent = "With love, the " + CONFIG.family + " invites you to the pre-wedding celebrations of";
$("bride").textContent = CONFIG.bride;
$("sig").textContent = "With love, " + CONFIG.family;
$("whenpill").textContent = CONFIG.dateText + " · " + CONFIG.timeText;
$("datebig").textContent = CONFIG.dateText;
$("timeline").textContent = CONFIG.timeText;
["dir1","dir2"].forEach(i => $(i).href = CONFIG.mapUrl);

/* cards + choices */
$("cards").innerHTML = CONFIG.events.map(e =>
  '<article class="cel '+e.k+'"><div class="pic" style="background-image:var(--img-'+e.k+')" role="img" aria-label="'+e.id+' illustration"></div><div class="in"><h3>'+e.id+'</h3><p class="tm">'+e.time+'</p><p>'+e.blurb+'</p></div></article>').join("");
$("evChoices").innerHTML = CONFIG.events.map(e =>
  '<label class="opt sq"><input type="checkbox" name="ev" value="'+e.id+'"><span>'+e.id+'</span></label>').join("");

/* countdown */
(function(){
  const s=new Date(CONFIG.startISO), e=new Date(CONFIG.endISO);
  if(isNaN(s)||isNaN(e)) return;
  const box=$("cd"), msg=$("cdmsg");
  function tick(){
    const now=Date.now(), ms=s-now;
    if(ms>0){
      box.hidden=false; msg.hidden=true;
      const t=Math.floor(ms/1000);
      $("cd-d").textContent=Math.floor(t/86400); $("cd-h").textContent=Math.floor(t%86400/3600);
      $("cd-m").textContent=Math.floor(t%3600/60); $("cd-s").textContent=t%60;
    } else {
      box.hidden=true; msg.hidden=false;
      msg.textContent = now<=e ? "The celebrations have begun. We’re so happy you’re here!" : "Thank you for celebrating with us.";
      if(now>e) clearInterval(timer);
    }
  }
  const timer=setInterval(tick,1000); tick();
})();

/* form */
let n=1, lastMsg="", locked=false;
const setN=v=>{n=Math.max(1,Math.min(CONFIG.maxGuests,v));$("count").textContent=n};
$("minus").onclick=()=>setN(n-1); $("plus").onclick=()=>setN(n+1);
const att=()=>document.querySelector('input[name=att]:checked').value;
document.querySelectorAll('input[name=att]').forEach(r=>r.onchange=()=>{$("yesBox").hidden=att()==="no";hidePreview()});
function hidePreview(){$("preview").hidden=true;$("status").textContent="";$("previewBtn").hidden=false}
document.querySelectorAll('input[name=ev], #name, #note2').forEach(el=>el.addEventListener('input',hidePreview));
$("edit").onclick=()=>{hidePreview();$("name").focus()};

function build(){
  const name=$("name").value.trim(), note=$("note2").value.trim();
  const picked=[...document.querySelectorAll('input[name=ev]:checked')].map(c=>c.value);
  if(name.length<2){return {err:"Please enter your full name.",el:$("name")}}
  if(att()==="yes"){
    if(!picked.length) return {err:"Please choose at least one celebration."};
    if(!(n>=1&&n<=CONFIG.maxGuests)) return {err:"Please choose between 1 and "+CONFIG.maxGuests+" guests."};
  }
  let m="Hello! This is "+name+".\n";
  m+= att()==="yes" ? "Joyfully attending: "+picked.join(", ")+"\nGuests: "+n : "Sorry, I’m unable to attend, but I’m sending my love and blessings.";
  if(note) m+="\nMessage: "+note;
  return {msg:m};
}
$("form").addEventListener("submit",ev=>{
  ev.preventDefault();
  const r=build();
  if(r.err){$("err").textContent=r.err;hidePreview();(r.el||$("evChoices").querySelector("input")).focus();return}
  $("err").textContent=""; lastMsg=r.msg;
  $("prevText").textContent=lastMsg; $("preview").hidden=false; $("previewBtn").hidden=true;
  $("preview").scrollIntoView({behavior:"smooth",block:"center"});
});
$("send").onclick=()=>{
  if(locked||!lastMsg) return; locked=true; $("send").disabled=true;
  window.open("https://wa.me/"+CONFIG.whatsapp+"?text="+encodeURIComponent(lastMsg),"_blank","noopener");
  $("status").textContent="WhatsApp should now be open. Please press Send there. Your RSVP only reaches us once you send the message. If WhatsApp didn’t open, use Copy message.";
  setTimeout(()=>{locked=false;$("send").disabled=false},5000);
};
$("copy").onclick=async()=>{
  try{await navigator.clipboard.writeText(lastMsg);$("status").textContent="Copied. Paste it into a WhatsApp message to the "+CONFIG.family+"."}
  catch(e){$("status").textContent="Couldn’t copy automatically. Please select the text above and copy it."}
};

/* gentle reveal */
if("IntersectionObserver" in window){
  const io=new IntersectionObserver(es=>es.forEach(x=>{if(x.isIntersecting){x.target.classList.add("in");io.unobserve(x.target)}}),{threshold:.12});
  document.querySelectorAll(".rv").forEach(el=>io.observe(el));
} else document.querySelectorAll(".rv").forEach(el=>el.classList.add("in"));
