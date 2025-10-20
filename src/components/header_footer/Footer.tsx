import { Github, Linkedin, Mail, MessageCircle, Phone } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = async () => {
  return (
    <footer className="border-t border-border bg-background">
      <div className="flex flex-col md:flex-row items-start justify-evenly px-6 gap-8 py-14">
        {/* Title and Description */}
        <div className="w-full md:w-2/5">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            LearnHub
          </h2>
          <p className="mt-6 text-sm text-muted-foreground">
            LearnHub is an educational platform that aims to provide
            high-quality courses and learning resources. Built with modern web
            technologies, it offers a seamless learning experience with
            interactive content, progress tracking, and expert guidance for
            students of all levels.
          </p>
        </div>

        {/* Contact Links */}
        <div className="w-full md:w-1/5 flex items-center justify-start">
          <div>
            <h2 className="font-medium mb-5 text-foreground">Contact me</h2>
            <ul className="text-sm space-y-2 text-muted-foreground">
              <li>
                <Link
                  className="hover:text-foreground transition flex items-center gap-2"
                  href="https://www.linkedin.com/in/abdullah-radwan-280140284/"
                  target="_blank"
                >
                  <Linkedin size={15} className="text-primary" />
                  LinkedIn
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-foreground transition flex items-center gap-2"
                  href="https://github.com/Abdullah-Radwan1"
                  target="_blank"
                >
                  <Github size={15} className="text-primary" />
                  GitHub
                </Link>
              </li>
              <li>
                <Link
                  className="hover:text-foreground transition flex items-center gap-2"
                  target="_blank"
                  href="https://wa.link/7thukh"
                >
                  <MessageCircle size={15} className="text-primary" />
                  WhatsApp
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Contact Information */}
        <div className="w-full md:w-1/5 flex items-start justify-start">
          <div>
            <h2 className="font-medium mb-5 text-foreground">Get in touch</h2>
            <div className="text-sm space-y-2 text-muted-foreground">
              <p className="flex items-center gap-2 hover:text-foreground transition">
                <Phone size={15} className="text-primary" />
                +01288265751
              </p>
              <p className="flex items-center gap-2 hover:text-foreground transition">
                <Mail size={15} className="text-primary" />
                abdullah.radwan.dev@gmail.com
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border py-4">
        <p className="text-center text-xs md:text-sm text-muted-foreground">
          Copyright 2025 © LearnHub. All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
