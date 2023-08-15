import cls from 'classnames';
import styles from './index.module.scss';

type Props = {
    className?: string;
};

export const DotsTyping = ({ className }: Props) => {
    return (
        <div className={styles.wrapper}>
            <span className={cls(styles.dotTyping, className)} />
        </div>
    );
};
