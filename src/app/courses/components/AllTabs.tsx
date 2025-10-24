"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../../../components/ui/button";
import { QuestionModal } from "./QuestionTab";
import { getQuestionsByCourseAction } from "@/lib/actions/questionActions";
import { Question } from "@/generated/prisma";
import { Award, BookOpenCheck, MessageCircleMore } from "lucide-react";

const AllTabs = ({ courseId }: { courseId: string }) => {
  // ✅ Smooth scroll helper

  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const take = 3;

  useEffect(() => {
    const fetchQuestions = async () => {
      const { questionWithUser, hasMore } = await getQuestionsByCourseAction({
        courseId,
        page,
        take,
      });
      setQuestions(questionWithUser);
      setHasMore(hasMore);
    };
    fetchQuestions();
  }, []);

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button variant="outline" onClick={() => scrollToSection("curriculum")}>
        <BookOpenCheck />
      </Button>
      <Button variant="outline">
        <Award />
      </Button>
      <QuestionModal
        questions={questions}
        setQuestions={setQuestions}
        hasMore={hasMore}
        setHasMore={setHasMore}
        page={page}
        setPage={setPage}
        courseId={courseId}
      />

      <Button variant="outline" onClick={() => scrollToSection("comments")}>
        <MessageCircleMore />
      </Button>
    </div>
  );
};

export default AllTabs;
