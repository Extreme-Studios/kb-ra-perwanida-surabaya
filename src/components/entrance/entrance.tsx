"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent } from "react";
import { entranceCopy as copy, entranceTiming, type EntranceData, type EntranceHotspot } from "@/data/content/entrance";
import "./entrance.css";

const subscribe=()=>()=>{};
export function Entrance({data}:{data:EntranceData}) {
  const router=useRouter();
  const ready=useSyncExternalStore(subscribe,()=>true,()=>false);
  const [entering,setEntering]=useState(false);
  const [active,setActive]=useState<EntranceHotspot|null>(null);
  const timer=useRef<ReturnType<typeof setTimeout>|null>(null);
  const busy=useRef(false);
  const scene=useRef<HTMLDivElement>(null);
  const dialog=useRef<HTMLDialogElement>(null);
  const opener=useRef<HTMLButtonElement|null>(null);
  useEffect(()=>{
    router.prefetch(data.homeHref);
    const reset=()=>{if(timer.current)clearTimeout(timer.current);busy.current=false;setEntering(false);dialog.current?.close();};
    window.addEventListener("pageshow",reset);
    window.addEventListener("popstate",reset);
    return ()=>{if(timer.current)clearTimeout(timer.current);window.removeEventListener("pageshow",reset);window.removeEventListener("popstate",reset);};
  },[router,data.homeHref]);
  function enter(event:FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if(busy.current)return;
    busy.current=true;
    setEntering(true);
    const reduced=window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    timer.current=setTimeout(()=>router.push(data.homeHref),reduced?entranceTiming.reduced:entranceTiming.normal);
  }
  function close(){dialog.current?.close();setActive(null);opener.current?.focus();}
  return <main className="entrance" data-entering={entering} aria-labelledby="entrance-title">
    <header className="entrance-header">
      <div className="entrance-brand">{data.logo.src&&<Image src={data.logo.src} alt={data.logo.alt} width={52} height={52} sizes="52px"/>}<span>{data.shortName}<small>{data.city}</small></span></div>
      <a className="entrance-direct" href={data.homeHref}>{copy.direct}<span aria-hidden="true">↗</span></a>
    </header>
    <div className="entrance-intro"><p>{copy.welcome}</p><h1 id="entrance-title">{data.shortName}{" "}<span>{data.city}</span></h1><p className="entrance-invitation">{copy.invitation}</p></div>
    <div className="entrance-scene" ref={scene}
      onPointerMove={event=>{
        if(event.pointerType!=="mouse"||entering||!window.matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine)").matches)return;
        const box=event.currentTarget.getBoundingClientRect();
        event.currentTarget.style.setProperty("--entrance-x",`${((event.clientX-box.left)/box.width-.5)*8}px`);
        event.currentTarget.style.setProperty("--entrance-y",`${((event.clientY-box.top)/box.height-.5)*5}px`);
      }} onPointerLeave={()=>{scene.current?.style.setProperty("--entrance-x","0px");scene.current?.style.setProperty("--entrance-y","0px");}}>
      <div className="entrance-photo-frame">
        <div className="entrance-photograph">{data.photo.src&&<Image src={data.photo.src} alt={data.photo.alt} fill priority sizes="(max-width: 767px) 100vw, 90vw"/>}</div>
        <div className="entrance-photo-shade" aria-hidden="true"/>
        <span className="entrance-photo-caption">{data.photoCaption} · {data.shortName}</span>
        <div className="entrance-gate" aria-hidden="true"><div className="entrance-gate-left"><span/></div><div className="entrance-gate-right"><span/></div></div>
      </div>
      <span className="entrance-sun" aria-hidden="true">✳</span>
      <span className="entrance-leaf entrance-leaf-left" aria-hidden="true"/><span className="entrance-leaf entrance-leaf-right" aria-hidden="true"/>
      <div className="entrance-hotspots" role="group" aria-label={copy.explore}>
        {data.hotspots.map((item,index)=><button type="button" key={item.id} className={"entrance-hotspot entrance-hotspot-"+item.id} disabled={!ready||entering} aria-label={`Informasi ${item.title}`} aria-haspopup="dialog" aria-controls="entrance-information" aria-expanded={active?.id===item.id}
          onClick={event=>{opener.current=event.currentTarget;setActive(item);dialog.current?.showModal();}}>
          <span aria-hidden="true">{String(index+1).padStart(2,"0")}</span>{item.title}<span aria-hidden="true">+</span>
        </button>)}
      </div>
      <form action={data.homeHref} onSubmit={enter} className="entrance-action">
        <button type="submit" className="entrance-enter" aria-disabled={entering}>{copy.enter}<span aria-hidden="true">→</span></button>
        <p>{copy.hint}</p>
      </form>
    </div>
    <footer className="entrance-footer"><span>{copy.lead}</span><p>{data.vision}</p></footer>
    <noscript><p className="entrance-noscript"><a href={data.homeHref}>{copy.enter} →</a></p></noscript>
    <div className="sr-only" role="status">{entering?"Membuka gerbang menuju website Perwanida.":""}</div>
    <dialog ref={dialog} id="entrance-information" className="entrance-dialog" aria-labelledby="entrance-info-title" onClose={()=>{setActive(null);opener.current?.focus();}}
      onKeyDown={event=>{
        if(event.key!=="Tab")return;
        const controls=Array.from(event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]"));
        const first=controls[0],last=controls[controls.length-1];
        if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
        if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
      }}
      onClick={event=>{if(event.target===event.currentTarget)close();}}>
      <div className="entrance-info-card"><button type="button" className="entrance-info-close" onClick={close} aria-label={copy.close}>×</button>
        <p className="entrance-info-eyebrow">{data.shortName}</p><h2 id="entrance-info-title">{active?.title??"Informasi sekolah"}</h2>
        <p>{active?.summary}</p>{active&&<Link href={active.href} className="entrance-info-link" onClick={()=>dialog.current?.close()}>{copy.detail}<span aria-hidden="true">↗</span></Link>}
      </div>
    </dialog>
  </main>;
}
