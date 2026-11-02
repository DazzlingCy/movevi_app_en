import { CircleCheck } from 'lucide-react';
import { DEFAULT_TREADMILL_NAME } from '../data/device';
import TreadmillIllustration from './TreadmillIllustration';
import Modal from './journey/Modal';
import styles from './DeviceConnectedPrompt.module.css';

interface DeviceConnectedPromptProps {
  onDismiss: () => void;
  onViewDevice: () => void;
}

export default function DeviceConnectedPrompt({ onDismiss, onViewDevice }: DeviceConnectedPromptProps) {
  return (
    <div className={styles.layer}>
      <Modal labelId="device-connected-title device-connected-status" onClose={onDismiss} className={styles.dialog}>
        <div className={styles.deviceIcon}><TreadmillIllustration className={styles.treadmill} /><CircleCheck className={styles.check} size={22} aria-hidden="true" /></div>
        <h2 id="device-connected-title">{DEFAULT_TREADMILL_NAME}</h2>
        <p id="device-connected-status" className={styles.connectionStatus}>{"Device Connected"}</p>
        <p className={styles.description}>{"The equipment's ready. Start your sports trip."}</p>
        <button type="button" className={styles.confirm} onClick={onDismiss}>{"Got it."}</button>
        <button type="button" className={styles.viewDevice} onClick={onViewDevice}>{"Check my equipment."}</button>
      </Modal>
    </div>
  );
}
