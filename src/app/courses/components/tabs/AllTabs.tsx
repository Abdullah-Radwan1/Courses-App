import { getQuestionsByCourseAction } from "@/lib/actions/questionActions";
import { QuestionModal } from "./QuestionTab";
import LeaderboardPage from "./LeaderboardTab";
import { BookOpenCheck, MessageCircleMore } from "lucide-react";
import { ScrollButton } from "./ScrollButton";

const AllTabs = async ({ courseId }: { courseId: string }) => {
  // ✅ fetch data on the server
  const take = 3;
  const page = 1;
  const { questionWithUser, hasMore } = await getQuestionsByCourseAction({
    courseId,
    page,
    take,
  });

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {/* Scroll buttons as client components */}
      <ScrollButton targetId="curriculum" icon={<BookOpenCheck />} />
      <LeaderboardPage id={courseId} />
      <QuestionModal
        initialQuestions={questionWithUser}
        initialHasMore={hasMore}
        initialPage={page}
        courseId={courseId}
      />
      <ScrollButton targetId="comments" icon={<MessageCircleMore />} />
    </div>
  );
};

export default AllTabs;
