import BlurBackground from "@/components/BlurBackground";
import Button from "@/components/Button";
import ExternalLink from "@/components/ExternalLink";
import BlogIcon from "@/icons/BlogIcon";
import InstagramIcon from "@/icons/Instagram";
import SignIcon from "@/icons/SignIcon";
import YoutubeIcon from "@/icons/YoutubeIcon";
import { type FC } from "react";

const SOCIAL_LINKS = {
  blog: "https://m.blog.naver.com/PostList.naver?blogId=hanr0r0&tab=1",
  instagram: "https://www.instagram.com/hanr0r0/?hl=ko",
  youtube: "https://www.youtube.com/@hanroro6055",
  homepage: "https://www.hanroro.com",
} as const;

const Home: FC = () => {
  return (
    <div className="relative h-dvh text-black">
      <BlurBackground />
      <SignIcon className="absolute bottom-[8%] left-[2%] w-60 text-[#deb754] sm:w-100 md:bottom-20 md:left-5 md:w-120" />
      <div className="absolute bottom-[2.5%] left-[3%]">
        <h3 className="text-left text-xs text-[#bbad85] md:text-sm">
          NOT OFFICIAL SITE
          <br />
          CONTACT : hyoeun.jin2@gmail.com
        </h3>
      </div>
      <div className="absolute right-[3%] bottom-[2.5%] flex flex-col gap-10 sm:gap-23 md:bottom-15">
        <ExternalLink href={SOCIAL_LINKS.blog} ariaLabel="Blog 채널로 이동">
          <Button variant="icon" size="sm">
            <BlogIcon className="h-7 text-[#38bb0c] sm:h-10" />
          </Button>
        </ExternalLink>
        <ExternalLink
          href={SOCIAL_LINKS.instagram}
          ariaLabel="Instagram 채널로 이동"
        >
          <Button variant="icon" size="sm">
            <InstagramIcon className="h-10 sm:h-14" />
          </Button>
        </ExternalLink>
        <ExternalLink
          href={SOCIAL_LINKS.youtube}
          ariaLabel="YouTube 채널로 이동"
        >
          <Button variant="icon" size="sm">
            <YoutubeIcon className="h-8 sm:h-12" />
          </Button>
        </ExternalLink>
        <ExternalLink
          href={SOCIAL_LINKS.homepage}
          ariaLabel="hanroro 홈페이지로 이동"
        >
          <Button variant="icon" size="sm">
            <img
              src="/images/hanroro.webp"
              alt="hanroro 홈페이지"
              className="h-9 rounded-4xl sm:h-13"
            />
          </Button>
        </ExternalLink>
      </div>
    </div>
  );
};

export default Home;
