function Preloader({ loaded }) {
  return (
    <div className={`preloader ${loaded ? 'loaded' : ''}`} data-preloader>
      <div className="circle"></div>
    </div>
  );
}

export default Preloader;