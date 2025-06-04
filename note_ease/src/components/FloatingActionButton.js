// PUBLIC_INTERFACE
/**
 * FloatingActionButton component for adding new notes
 * @param {Object} props - Component props
 * @param {Function} props.onClick - Callback when button is clicked
 * @param {string} props.icon - Icon to display (default: +)
 * @param {string} props.title - Tooltip text
 */
const FloatingActionButton = ({ onClick, icon = "+", title = "Add new note" }) => {
  return (
    <>
      <button
        className="fab"
        onClick={onClick}
        title={title}
        aria-label={title}
      >
        {icon}
      </button>
      
      <style jsx>{`
        .fab {
          position: fixed;
          bottom: 24px;
          right: 24px;
          width: 56px;
          height: 56px;
          background: var(--primary);
          border: none;
          border-radius: 50%;
          color: white;
          font-size: 24px;
          font-weight: 300;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(74, 144, 226, 0.4);
          transition: all 0.2s ease;
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .fab:hover {
          background: #357ABD;
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(74, 144, 226, 0.5);
        }
        
        .fab:active {
          transform: scale(0.95);
        }
        
        @media (max-width: 768px) {
          .fab {
            bottom: 20px;
            right: 20px;
            width: 52px;
            height: 52px;
            font-size: 22px;
          }
        }
      `}</style>
    </>
  );
};

export default FloatingActionButton;
