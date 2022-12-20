import { parseISO, formatDistanceToNow } from "date-fns";

const TimeAgo = ({ timestamp }) => {
    let timeAgo = "";
    let date = "";
    let title = "";

    if (timestamp) {
        date = parseISO(timestamp);
        title = date.toLocaleDateString() + " at " + date.toLocaleTimeString();
        timeAgo = formatDistanceToNow(date, { addSuffix: true });
    }

    const content = (
        <span className="p-0.5 text-xs italic text-gray-500" title={title}>
            {timeAgo}
        </span>
    );

    return content;
};

export default TimeAgo;
